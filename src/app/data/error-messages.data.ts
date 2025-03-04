export const errorMessages = {
  'username': [
    { type: 'required', message: 'Username is required' },
    { type: 'minlength', message: 'The username must contain at least 6 characters..' },
  ],

  'email': [
    { type: 'required', message: 'Email is required' },
    { type: 'minlength', message: 'The email address must contain at least 6 characters..' },
    { type: 'maxlength', message: 'The email address must contain no more than 256 characters.' },
    { type: 'email', message: 'Enter the correct email address.' }
  ],

  'code': [
    { type: 'required', message: 'Code is required' },
    { type: 'minlength', message: 'The confirmation code must contain at least 6 characters.' }
  ],
}
