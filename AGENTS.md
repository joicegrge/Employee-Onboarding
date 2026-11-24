# Employee Onboarding Assignment

The supplied `Angular Forms Assignment Employee Onboarding.pdf` is the single source of truth. This project implements only that assignment: one Employee Onboarding page for HR, built with Angular 22 Signal Forms.

## Exact scope

- Render one page with four sections: Personal, Employment, Address, and Skills.
- The model contains the employee's first name, last name, email, phone, date of birth, employment type, department, designation, joining date, optional end date, manager email, address, and skills.
- Employment types are `Full-time`, `Contract`, and `Intern`.
- Engineering designations: Frontend Developer, Backend Developer, QA Engineer.
- Design designations: UI Designer, UX Researcher.
- HR designations: HR Executive, Recruiter.
- Show only the selected department's designations and clear designation when department changes.
- Skills are addable/removable; each has a required name and a 1–5 rating provided by the reusable `StarRating` component.
- Display validation errors only after the field is touched or submission is attempted.
- Enable submission only when the form is valid and no async email check is pending. On valid submit, show a success message containing the employee's full name, then reset the form.

## Mandatory Angular Forms rules

- Use Angular 22 and imports from `@angular/forms/signals`.
- Keep a writable signal as the data model; create the form with `form(model, schema, options)`.
- Bind every form control, including `StarRating`, with `[formField]`.
- Define validation in the Signal Forms schema and render its `errors()` messages; do not hard-code field validation in the template.
- Do not use `FormBuilder`, `FormGroup`, `FormControl`, `ngModel`, or `ControlValueAccessor`.
- `StarRating` must implement the Signal Forms `FormValueControl<number>` contract and must not use `ControlValueAccessor`.
- Do not add routing or NgModules.

## Data model

```ts
interface Onboarding {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  employmentType: 'Full-time' | 'Contract' | 'Intern';
  department: string;
  designation: string;
  joiningDate: string;
  endDate: string | null;
  managerEmail: string;
  address: { line1: string; city: string; pin: string };
  skills: { name: string; rating: number }[];
}
```

## Eight validation requirements

1. First and last names are required, 2–50 characters, and contain only letters and spaces.
2. Email is required, syntactically valid, and must not already exist. Show “Checking…” during the asynchronous check.
3. Phone has exactly 10 digits and starts with 6, 7, 8, or 9.
4. Date of birth makes the employee at least 18 years old on the joining date.
5. End date is shown and required only for Contract and Intern, and must be after joining date.
6. Manager email is required and valid, and cannot equal the employee email.
7. Address line 1 and city are required. PIN has six digits and cannot start with 0.
8. There are 2–6 skills; every name is required and unique without case sensitivity; every rating is required and between 1 and 5 stars.

## Fake email API and interceptor

- Use an HTTP interceptor to fake `GET /api/check-email?email=...`.
- Respond after 800 ms with `{ exists: true }` for `admin@company.com` and `hr@company.com`; respond with `{ exists: false }` for other addresses.
- Use Signal Forms HTTP validation so the email field exposes pending state and duplicate-email errors.
- Do not add a real backend or make real network requests for this endpoint.

## Component integration

- Keep the page as the standalone root application component.
- Keep `StarRating` reusable and standalone; bind its numeric model with `[formField]`.
- Keep the fake email interceptor in a focused file and register it through `provideHttpClient(withInterceptors(...))`.
- Keep the assignment's model and schema easy to trace in the app source. Do not create additional page flows.

## Restrictions

- Do not add authentication, authorization, dashboards, backend databases, extra pages, routing, modules, fields, validation rules, or unrelated behavior.
- Do not add third-party UI/form libraries or other dependencies unless a specific assignment requirement cannot be met with Angular 22 and the existing standard dependencies.
- Preserve the supplied assignment PDF.

## Code quality and verification

- Use strict TypeScript, focused components, descriptive names, and accessible labels/controls.
- Keep validation logic in the schema, cross-field rules reactive, and UI messages sourced from Signal Forms errors.
- Before completion, run the Angular production build and check the project-local Angular, TypeScript, and Signal Forms versions.
- Review each of the eight rules, the dependent designation behavior, pending email check, submission gating, success message, and reset behavior against the PDF. Report verification honestly; a successful build alone does not prove runtime behavior.
