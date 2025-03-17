"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlusCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const getAuthToken = () => {
  const match = document.cookie.match(/(^| )authToken=([^;]+)/);
  return match ? match[2] : null;
};

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userID, setUserID] = useState<number | null>(null); // Armazenar o userID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setError("Sessão expirada. Faça login novamente.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:8000/api/marketplace/anuncios", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar anúncios.");
        }

        const data = await response.json();
        const ads = data.ads || [];
        setProducts(ads);
        setUserID(data.userID); // Setando o userID da resposta da API
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("Sessão expirada. Faça login novamente.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/marketplace/getmyfavorites", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar favoritos.");
        }

        const data = await response.json();
        const favoriteAdIds = data.favorites.map((favorites: any) => favorites.ad.id);
        setFavorites(favoriteAdIds);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getAuthToken();
    if (!token) {
      setError("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/marketplace/addfavorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ad_id: productId }),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar aos favoritos.");
      }

      const updatedFavorites = isFavorite(productId)
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId];
      setFavorites(updatedFavorites);

    } catch (err: any) {
      setError(err.message);
    }
  };

  const isFavorite = (productId: number) => favorites.includes(productId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <Button asChild>
          <Link href="/marketplace/adicionar">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Link>
        </Button>
      </div>

      {loading && <p className="text-center text-gray-500">Carregando anúncios...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500">Nenhum anúncio encontrado.</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.ad.id}
            href={`/marketplace/${product.ad.id}`}
            className="block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
          >
            <Card className="h-full overflow-hidden cursor-pointer relative">
              <div className="aspect-video w-full overflow-hidden">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.ad.title}
                  width={300}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="line-clamp-1 font-medium mb-1">{product.ad.title}</h3>
                    <p className="font-bold text-primary">{product.ad.price}€</p>
                  </div>
                  {/* Verificar se o anúncio é do usuário atual */}
                  {product.ad.created_by !== userID && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-12 w-12 rounded-full",
                        isFavorite(product.ad.id)
                          ? "text-red-500 hover:text-red-600"
                          : "text-muted-foreground hover:text-red-400"
                      )}
                      onClick={(e) => toggleFavorite(e, product.ad.id)}
                    >
                      <Heart className={cn("h-7 w-7", isFavorite(product.ad.id) ? "fill-current" : "")} />
                      <span className="sr-only">
                        {isFavorite(product.ad.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      </span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
  