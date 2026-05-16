
export const userLoginType = {
  GOOGLE : "GOOGLE",
  EMAIL_PASSWORD : "EMAIL_PASSWORD"
}

export const AvailbleSocialLogins = Object.values(userLoginType)

export const USER_TEMPORARY_TOKEN = 20 * 60 * 1000

export const  todoType = {
    EVENT : "Event",
    STICKY_NOTES : "Sticky Notes",
    OTHER : "Other"
}

export const todoTypeEnum = Object.values(todoType)
