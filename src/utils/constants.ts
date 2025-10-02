export const routes = {
  signIn: '/auth/sign-in',
  signUp: '/auth/sign-up',
}

export const regex = {
  minUpper: (min: number) => new RegExp(`^(?=.*[A-Z]).{${min},}$`),
  minLower: (min: number) => new RegExp(`^(?=.*[a-z]).{${min},}$`),
  minNumber: (min: number) => new RegExp(`^(?=.*[0-9]).{${min},}$`),
  minSymbol: (min: number) => new RegExp(`^(?=.*[^A-Za-z0-9]).{${min},}$`),
}
