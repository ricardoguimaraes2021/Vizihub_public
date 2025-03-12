import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao seu painel de controle.</p>
      </div>

      <Separator />

      <div className="space-y-6">
        <Card className="overflow-hidden border-none shadow-sm">
          <CardHeader className="bg-secondary/50 px-6">
            <CardTitle className="text-lg font-medium">Eventos Futuros</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Id</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[150px]">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{/* Table will be populated with data later */}</TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-sm">
          <CardHeader className="bg-secondary/50 px-6">
            <CardTitle className="text-lg font-medium">Meus Tickets Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Id</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="w-[150px]">Estado</TableHead>
                  <TableHead className="w-[150px]">Data de abertura</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{/* Table will be populated with data later */}</TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

