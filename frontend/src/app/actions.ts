"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// -- AUTHENTICATION ACTIONS --
export async function registerUser(prevState: any, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  };

  const response = await fetch("http://localhost:8000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(rawData),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  return response;
}

export async function loginUser(prevState: any, formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const response = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(rawData),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  if (response.success) {
    // Set access token in cookies
    cookies().set({
      name: "accessToken",
      value: response.data.access_token,
    });
    cookies().set({
      name: "user",
      value: JSON.stringify(response.data.user),
    });

    // Redirect to the dashboard
    redirect("/");
  }

  return response;
}

export const validateToken = async (token: string) => {
  const response = await fetch("http://localhost:8000/api/validate-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  return response;
};

const removeToken = async () => {
  cookies().delete("accessToken");
  cookies().delete("user");
};

export const authenticateUser = async () => {
  const token = cookies().get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  const isValid = await validateToken(token);
  console.log(isValid);

  if (!isValid.success) {
    // Clear the cookies
    removeToken();
    redirect("/login");
  }

  // Return the user
  const userData = JSON.parse(cookies().get("user")?.value || "{}");
  return userData;
};

export const logoutUser = async () => {
  // Clear the cookies
  cookies().delete("accessToken");
  cookies().delete("user");

  const response = await fetch("http://localhost:8000/api/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  console.log(response);

  if (response.success) {
    redirect("/login");
  }
};

// -- END OF AUTHENTICATION ACTIONS --

// -- TODO ACTIONS --
export const addTodo = async (prevState: any, formData: FormData) => {
  const token = cookies().get("accessToken")?.value;

  const rawData = {
    title: formData.get("todo"),
  };

  const response = await fetch("http://localhost:8000/api/u/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(rawData),
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(err);
    });

  revalidatePath("/");
  const responseData = { success: true, ...response };
  return responseData;
};

export const fetchTodos = async () => {
  const token = cookies().get("accessToken")?.value;

  const response = await fetch("http://localhost:8000/api/u/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
  return response.data;
};

export const deleteTodos = async (todoId: string) => {};

// -- END OF TODO ACTIONS --
