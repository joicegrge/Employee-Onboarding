# Employee Onboarding System

A single-page employee onboarding form for the HR team. The application is implemented with Angular 22 Signal Forms and follows the scope of the Employee Onboarding assignment.

## Project Overview

The form collects an employee's personal, employment, address, and skill information in one page. It provides field validation, asynchronously checks employee email availability against a simulated API, and shows a success message before resetting the form after a valid submission.

The page has four sections:

1. **Personal** - identity and contact details.
2. **Employment** - employment type, department, designation, dates, and manager email.
3. **Address** - mailing address and PIN.
4. **Skills** - two to six named skills with star ratings.

The form model, schema validation, and field bindings use Angular 22 Signal Forms from `@angular/forms/signals`.

## Technologies Used

| Technology | Version or use |
| --- | --- |
| Angular | 22.3.0 (installed) |
| TypeScript | 6.0.3 (installed) |
| HTML | Angular component templates |
| CSS | Component and global styling |
| Angular Signal Forms | `@angular/forms/signals` model, schema, validation, and `[formField]` bindings |
| Angular HTTP | Functional HTTP interceptor for the simulated email check |
| RxJS | 7.8.2 (installed); `of()` and `delay()` implement the simulated response |

## Application Sections

### Personal

- **First Name**
- **Last Name**
- **Employee Email** - checked asynchronously for availability.
- **Phone**
- **Date of Birth**

### Employment

- **Employment Type** - Full-time, Contract, or Intern.
- **Department** - Engineering, Design, or HR.
- **Designation** - options depend on the selected department.
- **Joining Date**
- **End Date** - displayed only for Contract and Intern.
- **Manager Email**

Designation options are mapped as follows:

| Department | Designations |
| --- | --- |
| Engineering | Frontend Developer, Backend Developer, QA Engineer |
| Design | UI Designer, UX Researcher |
| HR | HR Executive, Recruiter |

Changing the department clears the current designation and presents the options for the newly selected department.

### Address

- **Address Line 1**
- **City**
- **PIN**

### Skills

Users can add or remove skills, subject to a minimum of two and maximum of six. Each skill has a required name and a rating selected with the reusable `StarRating` component.

## Validation Rules

The following table reflects the assignment's eight validation requirements.

| Validation ID | Field | Validation requirement |
| --- | --- | --- |
| VR-1 | First name, last name | Both are required, contain 2 to 50 characters, and use letters and spaces only. |
| VR-2 | Employee email | Required and valid; must not already exist. An asynchronous check runs, with “Checking…” shown while it is pending. |
| VR-3 | Phone | Exactly 10 digits, starting with 6, 7, 8, or 9. |
| VR-4 | Date of birth | The employee must be at least 18 years old on the joining date. |
| VR-5 | End date | Shown and required only for Contract and Intern; must be after the joining date. |
| VR-6 | Manager email | Required and valid; cannot be the same as the employee's email. |
| VR-7 | Address | Address Line 1 and City are required. PIN must contain six digits and cannot start with 0. |
| VR-8 | Skills | Requires 2 to 6 skills. Every name is required and unique without case sensitivity; every rating is required and must be from 1 to 5 stars. |

## Angular Signal Forms Implementation

The root `App` component keeps the onboarding data in a writable signal and creates the form using `form(model, schema, options)` from `@angular/forms/signals`. The schema defines field and collection validation rules, including cross-field checks and the asynchronous email check. Template controls, including the custom rating control, bind with `[formField]`.

Validation feedback is rendered from the form fields' `errors()` values. Messages appear after a field is touched or a submission is attempted. The project does not use `FormBuilder`, `FormGroup`, or `ngModel`; those APIs are outside the assignment's required Signal Forms approach.

## Reusable StarRating Component

`StarRating` displays five accessible star buttons and supports ratings from one to five. Its numeric model uses Angular's Signal Forms `FormValueControl<number>` contract, so it integrates through `[formField]` without implementing `ControlValueAccessor`.

## Asynchronous Email Validation

The fake email endpoint is:

```text
GET /api/check-email?email=...
```

The functional HTTP interceptor handles only `GET` requests to `/api/check-email`. It waits 800 ms and returns:

- `admin@company.com` - `{ "exists": true }`
- `hr@company.com` - `{ "exists": true }`
- Other email addresses - `{ "exists": false }`

The employee email field displays a checking indicator while the asynchronous validation is pending and reports an error when the response marks the email as existing. This endpoint is simulated by the interceptor; it does not connect to a real backend.

## Form Submission

Submission is disabled while the form is invalid, the email check is pending, or submission is in progress. A valid submission displays a success message containing the employee's full name and resets the form to its initial values.

## Project Structure

```text
Employee-Onboarding/
├── AGENTS.md
├── README.md
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── public/
│   └── favicon.ico
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css
    └── app/
        ├── app.config.ts
        ├── app.css
        ├── app.html
        ├── app.ts
        ├── email-check.interceptor.ts
        ├── onboarding.model.ts
        ├── star-rating.css
        ├── star-rating.html
        └── star-rating.ts
```

## Installation and Setup

```bash
git clone https://github.com/joicegrge/Employee-Onboarding.git
cd Employee-Onboarding
npm install
npm start
```

The development server is available at [http://localhost:4200/](http://localhost:4200/).

## Testing and Verification

The following are manual scenarios for checking the assignment behavior. They are a test checklist, not a report that each scenario has been executed. No automated test script is defined in `package.json`.

- [ ] Leave required fields empty and verify errors appear after touching fields or attempting submission.
- [ ] Enter malformed and valid employee email addresses; check duplicate addresses (`admin@company.com` and `hr@company.com`) and an available address, and observe the pending indicator.
- [ ] Try phone values that do not have exactly 10 digits or do not start with 6, 7, 8, or 9, then try a valid value.
- [ ] Check the minimum-age rule relative to the joining date, including a date before and after the employee's 18th birthday.
- [ ] Select Full-time, Contract, and Intern. Confirm the end date is conditional, required for Contract and Intern, and later than the joining date.
- [ ] Check that manager email is required, must be valid, and must differ from the employee email.
- [ ] Check required address fields and PIN values with six digits, fewer or more digits, and a leading zero.
- [ ] Try fewer than two skills, two through six skills, and more than six; check required names and case-insensitive duplicate detection.
- [ ] Select a one-to-five-star rating for each skill and verify that an unselected rating is invalid.
- [ ] Change departments and check the designation options and clearing behavior.
- [ ] Complete all required fields with valid values, submit, and check the success message and form reset.

## Assignment Compliance

- [x] One page with Personal, Employment, Address, and Skills sections.
- [x] Implements VR-1 through VR-8 as documented above.
- [x] Uses Angular 22 Signal Forms with a model signal, `form()` schema, and `[formField]` bindings.
- [x] Does not use `FormBuilder`, `FormGroup`, or `ngModel`.
- [x] Integrates reusable `StarRating` without `ControlValueAccessor`.
- [x] Simulates the email endpoint with an HTTP interceptor and an 800 ms response delay.
- [x] Gates submission on validity and pending work, then shows the employee's full name and resets the form.

## Screenshot

<img width="1906" height="905" alt="image" src="https://github.com/user-attachments/assets/fa9e9ba0-ae4c-43a4-96e3-c9de6c8aee0e" />


## Scope

This project implements the Employee Onboarding assignment as a single-page form. Email availability is simulated locally by an HTTP interceptor; there is no real backend or database.
