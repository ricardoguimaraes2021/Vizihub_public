"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password recovery logic here
    console.log("Password recovery requested for:", email)
    setIsSubmitted(true)
  }

  return (
    <>
      <h1 className="mb-8 text-center text-2xl font-semibold">Recuperar Password</h1>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemplo@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-[#5b9af5] hover:bg-[#4a8ae5]">
            Recuperar
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Enviamos um email com instruções para recuperar sua senha.
                </p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link href="/login" className="text-sm text-[#5b9af5] hover:text-[#4a8ae5]">
              Voltar para o login
            </Link>
          </div>
        </div>
      )}

      {!isSubmitted && (
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Voltar para o login
          </Link>
        </div>
      )}
    </>
  )
}

