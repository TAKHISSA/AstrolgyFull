export function validateEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return regex.test(email);
}