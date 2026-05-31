
export const userLoginType = {
  GOOGLE : "GOOGLE",
  EMAIL_PASSWORD : "EMAIL_PASSWORD"
}

export const AvailbleSocialLogins = Object.values(userLoginType)

export const USER_TEMPORARY_TOKEN = 20 * 60 * 1000

export const todoType = {
    Personal: "Personal",
    Work: "Work",
    Shopping: "Shopping",
    Health: "Health",
    Other: "Other",
    Education: "Education",
    Family: "Family",
    Travel: "Travel",
    Bills: "Bills",
    Fitness: "Fitness",
    Meeting: "Meeting"
}

export const todoTypeEnum = Object.values(todoType)
