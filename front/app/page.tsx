'use client'

import {
  type BaseError,
  useAccount,
  useAccountEffect,
  useChainId,
  useConnect,
  useDisconnect,
  useEnsName,
} from 'wagmi'

import React from "react";
import { redirect } from "next/navigation";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  useAccountEffect({
    onConnect(_data) {
      // console.log('onConnect', data)
    },
    onDisconnect() {
      // console.log('onDisconnect')
    },
  })

  async function Login(data:FormData) {
    const formData={
        title:data.get("user")!.toString(),
        content:data.get("password")!.toString(),
    }
    await prisma.entry.create({data:formData})
    
    redirect("/news")
}

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      {/* <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <Connect />
      </div> */}
      
      <body>
        <div>
          <form action={Login}>
            <p>Login</p>  
            <label htmlFor="user">User</label>
            <input type="text" name="user" id="user" placeholder="User" />
            <label htmlFor="password">Content</label>
            <textarea name="password" id="password" placeholder="Password" />
            <button type="submit">login</button>
          </form>
        </div>
        <div>
          <Link
            href="http://localhost:3000/users/singup"
            className="font-medium underline underline-offset-4 hover:text-black transition-colors"
          >
            Sing Up
          </Link>
        </div>
      </body>

    </main>
  );
}


function Connect() {
  const chainId = useChainId();
  const { connectors, connect, status, error } = useConnect();
  const thirdConnector = connectors[2];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <p>connect</p>
      {thirdConnector && (
        <button
          className="button-blue"
          key={thirdConnector.uid}
          onClick={() => connect({ connector: thirdConnector, chainId })}
          type="button"
        >
          {thirdConnector.name}
        </button>
      )}
    </div>
  );
}