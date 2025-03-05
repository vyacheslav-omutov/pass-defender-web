export const errorMessages = {
  'username': [
    { type: 'required', message: 'Username is required' },
    { type: 'minlength', message: 'Username must be at least 6 characters' },
    { type: 'maxlength', message: 'Username must be less than 20 characters' },
    { type: 'pattern', message: 'Username must be alphanumeric characters or underscores' }
  ],

  'email': [
    { type: 'required', message: 'Email is required' },
    { type: 'minlength', message: 'Email must be at least 6 characters' },
    { type: 'maxlength', message: 'Email must be less than 256 characters' },
    { type: 'email', message: 'Invalid email address' }
  ]
}
