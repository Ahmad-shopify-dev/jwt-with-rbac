// FAKE DATABASE TO HANDLE USER DATA
const users = [
  {
    name: "Alice Admin",
    email: "admin@example.com",
    password: "$2a$10$17B3nHRBE8QO07bYpGYQKuFVX6CMVx74tkKEhKwUNkw.trZR37L2q",
    role: "admin",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    password: "$2a$10$17B3nHRBE8QO07bYpGYQKuFVX6CMVx74tkKEhKwUNkw.trZR37L2q",
    role: "user",
  },
  {
    name: "Charlie Davis",
    email: "charlie@example.com",
    password: "$2a$10$17B3nHRBE8QO07bYpGYQKuFVX6CMVx74tkKEhKwUNkw.trZR37L2q",
    role: "user",
  },
  {
    name: "Diana Prince",
    email: "diana@example.com",
    password: "$2a$10$17B3nHRBE8QO07bYpGYQKuFVX6CMVx74tkKEhKwUNkw.trZR37L2q",
    role: "user",
  },
  {
    name: "Ethan Hunt",
    email: "ethan@example.com",
    password: "$2a$10$17B3nHRBE8QO07bYpGYQKuFVX6CMVx74tkKEhKwUNkw.trZR37L2q",
    role: "user",
  },
  {
    name: "Fiona Gallagher",
    email: "fiona@example.com",
    password: "$2a$10$17B3nHRBE8QO07bYpGYQKuFVX6CMVx74tkKEhKwUNkw.trZR37L2q",
    role: "user",
  },
  {
    name: "George Miller",
    email: "george@example.com",
    password: "$2a$10$17B3nHRBE8QO07bYpGYQKuFVX6CMVx74tkKEhKwUNkw.trZR37L2q",
    role: "user",
  },
  {
    name: "Hannah Abbott",
    email: "hannah@example.com",
    password: "$2a$10$17B3nHRBE8QO07bYpGYQKuFVX6CMVx74tkKEhKwUNkw.trZR37L2q",
    role: "user",
  },
  {
    name: "Ian Wright",
    email: "ian@example.com",
    password: "$2a$10$17B3nHRBE8QO07bYpGYQKuFVX6CMVx74tkKEhKwUNkw.trZR37L2q",
    role: "user",
  },
  {
    name: "Julia Roberts",
    email: "julia@example.com",
    password: "$2a$10$17B3nHRBE8QO07bYpGYQKuFVX6CMVx74tkKEhKwUNkw.trZR37L2q",
    role: "user",
  },
];

export const getAllUsers = () => {
    const filterNormalUsers = users.filter(user => user.role === "user");
    const usersWithoutPassword = filterNormalUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    return usersWithoutPassword;
}

export const getUserByEmail = (email) => {
    if(!email) return null;
    return users.find(user => user.email === email);
}

export const createUser = (name, email, password, role = 'user') => {
    if(!name || !email || !password) return null;
    const newUser = {
        userId: users.length + 1,
        name,
        email,
        password: password,
        role: role
    }
    users.push(newUser);
    return newUser;
}

// FAKE DB TO HANDLE REFRESH AND ACCESS TOKENS
const refreshTokens = [];

export const addRefreshToken = (token) => {
  refreshTokens.push(token);
}

export const validateRefreshToken = (token) => {
  return refreshTokens.includes(token);
}

export const removeRefreshToken = (token) => {
  const index = refreshTokens.indexOf(token);
  if(index > - 1) {
    refreshTokens.splice(index, 1);
  }
}


