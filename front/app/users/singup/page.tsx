import React from 'react';
import { redirect } from "next/navigation";

async function createEntry(data:FormData) {
  "use server"
  const formData={
      title:data.get("user")!.toString(),
      content:data.get("password")!.toString(),
  }
  await prisma.entry.create({data:formData})
  
  redirect("/news")
}

export default function SingUp() {
  return (
    <body>
    <div>
      <form action={createEntry}>
        <p>Sing Up</p>  
        <label htmlFor="user">User</label>
        <input type="text" name="user" id="user" placeholder="User" />
        <label htmlFor="password">Content</label>
        <textarea name="password" id="password" placeholder="Password" />
        <button type="submit">create</button>
      </form>
    </div>
    </body>
  );
}
