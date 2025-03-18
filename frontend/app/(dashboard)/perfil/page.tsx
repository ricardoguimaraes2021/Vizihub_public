"use client"

import type React from "react"

import { useState, useRef } from "react"
import { LogOut, Upload, Save, X, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PerfilPage() {
  // Estado para controlar o modo de edição
  const [isEditing, setIsEditing] = useState(false)

  // Estado para os dados do usuário
  const [userData, setUserData] = useState({
    nome: "João",
    dataNascimento: "2000-12-28",
    email: "joao@gmail.com",
    cc: "19324413",
    numeroCasa: "13",
  })

  // Estado para a imagem do perfil
  const [avatarSrc, setAvatarSrc] = useState("/placeholder.svg")
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogout = () => {
    // Implementar lógica de logout aqui
    console.log("Logging out...")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewAvatarFile(file)
      // Criar uma URL temporária para visualização
      const imageUrl = URL.createObjectURL(file)
      setAvatarSrc(imageUrl)
    }
  }

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar os dados no backend
    console.log("Salvando dados:", userData)
    console.log("Nova imagem:", newAvatarFile)

    // Após salvar, sair do modo de edição
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Resetar para os valores originais
    setIsEditing(false)
    // Se houver uma nova imagem temporária, reverter
    if (newAvatarFile) {
      setAvatarSrc("/placeholder.svg")
      setNewAvatarFile(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais.</p>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout} className="hidden sm:flex">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      <Separator />

      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="bg-secondary/50 px-6">
          <CardTitle className="text-lg font-medium">Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={avatarSrc} alt="Profile picture" />
                  <AvatarFallback className="bg-secondary text-primary">JD</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-primary text-white h-8 w-8"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" name="nome" value={userData.nome} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                    <Input
                      id="dataNascimento"
                      name="dataNascimento"
                      type="date"
                      value={userData.dataNascimento}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={userData.email} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cc">CC</Label>
                    <Input id="cc" name="cc" value={userData.cc} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numeroCasa">Nº Casa</Label>
                    <Input id="numeroCasa" name="numeroCasa" value={userData.numeroCasa} onChange={handleInputChange} />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                    <div className="text-lg font-medium">{userData.nome}</div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-muted-foreground">Data de Nascimento</label>
                    <div className="text-lg">{new Date(userData.dataNascimento).toLocaleDateString("pt-PT")}</div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <div className="text-lg">{userData.email}</div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-muted-foreground">CC</label>
                    <div className="text-lg">{userData.cc}</div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-muted-foreground">Nº Casa</label>
                    <div className="text-lg">{userData.numeroCasa}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-4 border-t bg-secondary/20 px-6 py-4">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          </CardFooter>
        )}
      </Card>

      <Button variant="outline" onClick={handleLogout} className="w-full sm:hidden">
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  )
}

