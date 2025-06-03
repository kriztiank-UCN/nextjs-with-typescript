/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { readFile, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

export const createUser = async (prevState: any, formData: FormData) => {
  "use server";
  // current state of the form
  console.log(prevState);

  await new Promise(resolve => setTimeout(resolve, 3000));
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const newUser: User = { firstName, lastName, id: Date.now().toString() };
  try {
    // throw Error("this is a test error");
    await saveUser(newUser);
    revalidatePath("/actions");
    return "user created successfully...";
  } catch (error) {
    console.error(error);
    return "failed to create user...";
  }
  // redirect("/");
};

export const fetchUsers = async (): Promise<User[]> => {
  const result = await readFile("users.json", { encoding: "utf8" });
  const users = result ? JSON.parse(result) : [];
  return users;
};

const saveUser = async (user: User) => {
  const users = await fetchUsers();
  users.push(user);
  await writeFile("users.json", JSON.stringify(users));
};
