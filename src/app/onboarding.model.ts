export type EmploymentType = 'Full-time' | 'Contract' | 'Intern';

export interface Skill {
  name: string;
  rating: number;
}

export interface Onboarding {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  employmentType: EmploymentType;
  department: string;
  designation: string;
  joiningDate: string;
  endDate: string | null;
  managerEmail: string;
  address: {
    line1: string;
    city: string;
    pin: string;
  };
  skills: Skill[];
}

export function createInitialOnboarding(): Onboarding {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    employmentType: 'Full-time',
    department: '',
    designation: '',
    joiningDate: '',
    endDate: null,
    managerEmail: '',
    address: {
      line1: '',
      city: '',
      pin: '',
    },
    skills: [
      { name: '', rating: 0 },
      { name: '', rating: 0 },
    ],
  };
}
