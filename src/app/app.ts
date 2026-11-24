import { Component, computed, signal } from '@angular/core';
import {
  applyEach,
  applyWhen,
  email,
  form,
  FormField,
  FormRoot,
  max,
  maxLength,
  min,
  minLength,
  pattern,
  required,
  validate,
  validateHttp,
} from '@angular/forms/signals';
import { StarRating } from './star-rating';
import { createInitialOnboarding, EmploymentType, Onboarding } from './onboarding.model';

const departments = ['Engineering', 'Design', 'HR'] as const;

const designationsByDepartment: Record<string, string[]> = {
  Engineering: ['Frontend Developer', 'Backend Developer', 'QA Engineer'],
  Design: ['UI Designer', 'UX Researcher'],
  HR: ['HR Executive', 'Recruiter'],
};

function isAtLeastEighteen(dateOfBirth: string, joiningDate: string): boolean {
  const birth = new Date(`${dateOfBirth}T00:00:00Z`);
  const joining = new Date(`${joiningDate}T00:00:00Z`);

  if (Number.isNaN(birth.getTime()) || Number.isNaN(joining.getTime())) {
    return false;
  }

  let age = joining.getUTCFullYear() - birth.getUTCFullYear();
  const beforeBirthdayThisYear =
    joining.getUTCMonth() < birth.getUTCMonth() ||
    (joining.getUTCMonth() === birth.getUTCMonth() && joining.getUTCDate() < birth.getUTCDate());

  if (beforeBirthdayThisYear) {
    age -= 1;
  }

  return age >= 18;
}

@Component({
  imports: [FormField, FormRoot, StarRating],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly departments = departments;
  protected readonly employmentTypes: EmploymentType[] = ['Full-time', 'Contract', 'Intern'];
  protected readonly model = signal<Onboarding>(createInitialOnboarding());
  protected readonly submitted = signal(false);
  protected readonly successMessage = signal('');
  protected readonly availableDesignations = computed(
    () => designationsByDepartment[this.model().department] ?? [],
  );
  protected readonly isFixedTerm = computed(
    () => this.model().employmentType === 'Contract' || this.model().employmentType === 'Intern',
  );

  protected readonly onboardingForm = form(
    this.model,
    (path) => {
      required(path.firstName, { message: 'First name is required.' });
      minLength(path.firstName, 2, { message: 'First name must be at least 2 characters.' });
      maxLength(path.firstName, 50, { message: 'First name cannot exceed 50 characters.' });
      pattern(path.firstName, /^[\p{L} ]+$/u, {
        message: 'Use letters and spaces only.',
      });

      required(path.lastName, { message: 'Last name is required.' });
      minLength(path.lastName, 2, { message: 'Last name must be at least 2 characters.' });
      maxLength(path.lastName, 50, { message: 'Last name cannot exceed 50 characters.' });
      pattern(path.lastName, /^[\p{L} ]+$/u, {
        message: 'Use letters and spaces only.',
      });

      required(path.email, { message: 'Email is required.' });
      email(path.email, { message: 'Enter a valid email address.' });
      validateHttp(path.email, {
        request: ({ value }) => {
          const address = value().trim();
          return address
            ? `/api/check-email?email=${encodeURIComponent(address)}`
            : undefined;
        },
        onSuccess: (response: { exists: boolean }) =>
          response.exists
            ? { kind: 'emailExists', message: 'This email address already exists.' }
            : null,
        onError: () => ({
          kind: 'emailCheckFailed',
          message: 'Email availability could not be checked. Try again.',
        }),
      });

      required(path.phone, { message: 'Phone number is required.' });
      pattern(path.phone, /^[6-9]\d{9}$/, {
        message: 'Enter 10 digits starting with 6, 7, 8, or 9.',
      });

      required(path.dateOfBirth, { message: 'Date of birth is required.' });
      required(path.joiningDate, { message: 'Joining date is required to validate age.' });
      validate(path.dateOfBirth, ({ value, valueOf }) => {
        const dateOfBirth = value();
        const joiningDate = valueOf(path.joiningDate);

        if (!dateOfBirth || !joiningDate) {
          return null;
        }

        return isAtLeastEighteen(dateOfBirth, joiningDate)
          ? null
          : {
              kind: 'minimumAge',
              message: 'Employee must be at least 18 years old on the joining date.',
            };
      });

      validate(path.managerEmail, ({ value, valueOf }) => {
        const managerEmail = value().trim().toLowerCase();
        const employeeEmail = valueOf(path.email).trim().toLowerCase();

        return managerEmail && employeeEmail && managerEmail === employeeEmail
          ? {
              kind: 'sameEmail',
              message: 'Manager email must differ from employee email.',
            }
          : null;
      });
      required(path.managerEmail, { message: 'Manager email is required.' });
      email(path.managerEmail, { message: 'Enter a valid manager email address.' });

      required(path.address.line1, { message: 'Address line 1 is required.' });
      required(path.address.city, { message: 'City is required.' });
      pattern(path.address.pin, /^[1-9]\d{5}$/, {
        message: 'PIN must be 6 digits and cannot start with 0.',
      });

      minLength(path.skills, 2, { message: 'Add at least 2 skills.' });
      maxLength(path.skills, 6, { message: 'You can add no more than 6 skills.' });
      validate(path.skills, ({ value }) => {
        const names = value()
          .map((skill) => skill.name.trim().toLowerCase())
          .filter((name) => name.length > 0);
        const uniqueNames = new Set(names);

        return uniqueNames.size === names.length
          ? null
          : {
              kind: 'duplicateSkillName',
              message: 'Skill names must be unique, ignoring letter case.',
            };
      });
      applyEach(path.skills, (skill) => {
        required(skill.name, { message: 'Skill name is required.' });
        required(skill.rating, { message: 'Choose a star rating.' });
        min(skill.rating, 1, { message: 'Choose a rating from 1 to 5 stars.' });
        max(skill.rating, 5, { message: 'Rating cannot exceed 5 stars.' });
      });

      applyWhen(
        path,
        ({ valueOf }) => {
          const employmentType = valueOf(path.employmentType);
          return employmentType === 'Contract' || employmentType === 'Intern';
        },
        (conditionalPath) => {
          required(conditionalPath.endDate, { message: 'End date is required.' });
          validate(conditionalPath.endDate, ({ value, valueOf }) => {
            const endDate = value();
            const joiningDate = valueOf(conditionalPath.joiningDate);

            return endDate && joiningDate && endDate <= joiningDate
              ? {
                  kind: 'endDateAfterJoining',
                  message: 'End date must be after the joining date.',
                }
              : null;
          });
        },
      );
    },
    {
      submission: {
        ignoreValidators: 'none',
        onInvalid: () => this.submitted.set(true),
        action: async (field) => {
          const { firstName, lastName } = field().value();
          this.successMessage.set(`Employee ${firstName} ${lastName} was onboarded successfully.`);
          this.submitted.set(false);
          field().reset(createInitialOnboarding());
        },
      },
    },
  );

  protected clearDesignation(): void {
    this.model.update((current) => ({ ...current, designation: '' }));
  }

  protected limitDateOfBirthYear(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const match = /^\+?(\d+)-(\d{2})-(\d{2})$/.exec(input.value);

    if (!match || match[1].length <= 4) {
      return;
    }

    const normalizedYear = match[1].replace(/^0+/, '') || '0';
    const year = normalizedYear.slice(0, 4).padStart(4, '0');
    const limitedValue = `${year}-${match[2]}-${match[3]}`;

    queueMicrotask(() => {
      input.value = limitedValue;
      this.model.update((current) => ({ ...current, dateOfBirth: limitedValue }));
    });
  }

  protected onEmploymentTypeChange(event: Event): void {
    const employmentType = (event.target as HTMLSelectElement).value as EmploymentType;

    if (employmentType === 'Full-time') {
      this.model.update((current) => ({ ...current, employmentType, endDate: null }));
    }
  }

  protected addSkill(): void {
    this.model.update((current) => ({
      ...current,
      skills: [...current.skills, { name: '', rating: 0 }],
    }));
    this.onboardingForm.skills().markAsTouched({ skipDescendants: true });
  }

  protected removeSkill(index: number): void {
    this.model.update((current) => ({
      ...current,
      skills: current.skills.filter((_, skillIndex) => skillIndex !== index),
    }));
    this.onboardingForm.skills().markAsTouched({ skipDescendants: true });
  }

  protected hasTouchedSkill(): boolean {
    for (const skill of this.onboardingForm.skills) {
      if (skill.name().touched() || skill.rating().touched()) {
        return true;
      }
    }

    return false;
  }
}
