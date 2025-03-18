<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ads;
use App\Models\AdsChat;
use Illuminate\Support\Facades\Auth;
use App\Models\Categories;
use App\Models\ProductsState;
use App\Models\AdsMessages;
use App\Models\AdsFavorite;
use Carbon\Carbon;
use App\Events\NewChatMessage;
use Illuminate\Support\Facades\Mail;




class MarketplaceController extends Controller
{
   
    public function getAllCategory()
    {
        $categories = Categories::all();
        return response()->json(['categories' => $categories], 200);
    }

    public function getAllProdcutState()
    {
        $productsState = ProductsState::all();
        return response()->json(['productsState' => $productsState], 200);
    }

    public function getAllActiveAds()
    {
        $userId = Auth::id();
        $ads = Ads::where('status_id', 2)
        ->orderBy('created_at', 'desc')
        ->get();        $adsWithImages = [];
    
        foreach ($ads as $ad) {

            $adFolder = public_path("uploads/ads/{$ad->id}");
            $imagePaths = [];
    
            if (file_exists($adFolder)) {
                $files = scandir($adFolder);
                foreach ($files as $file) {
                    if ($file !== '.' && $file !== '..') {
                        $imagePaths[] = url("uploads/ads/{$ad->id}/{$file}");
                    }
                }
            }
    
            $adsWithImages[] = [
                'ad' => $ad,
                'images' => $imagePaths
            ];
        }
    
        return response()->json(['ads' => $adsWithImages, 'userID' => $userId], 200);
    }

    public function getById($id)
    {
        $userId = Auth::id();

        $ad = Ads::with(['user', 'category', 'state'])->find($id);
    
        if (!$ad) {
            return response()->json(['message' => 'Anúncio não encontrado'], 404);
        }
    
        $adFolder = public_path("uploads/ads/{$id}");
        $imagePaths = [];
    
        if (file_exists($adFolder)) {
            $files = scandir($adFolder);
            foreach ($files as $file) {
                if ($file !== '.' && $file !== '..') {
                    $imagePaths[] = url("uploads/ads/{$id}/{$file}");
                }
            }
        }
    
        return response()->json([
            'ad' => [
                'id' => $ad->id,
                'title' => $ad->title,
                'description' => $ad->description,
                'price' => $ad->price,
                'category_id' => $ad->category_id,
                'category_name' => $ad->category->name ?? 'Não especificado',
                'state_product_id' => $ad->state_product_id,
                'state_product_name' => $ad->state->name ?? 'Não especificado',
                'state_name' => $ad->status_id->name ?? 'Não especificado',
                'created_by' => $ad->created_by,
                'seller_name' => $ad->user->name ?? 'Vendedor desconhecido',
                'created_at' => Carbon::parse($ad->created_at)->format('d-m-Y'),

            ],
            'images' => $imagePaths,
            'user_id' => $userId
        ], 200);
    }
    
    public function getAllMyAds()
    {
        $userId = Auth::id();
        $ads = Ads::with('status')->where('created_by', $userId)->get();        
        
        $adsWithImages = [];

        foreach ($ads as $ad) {

            $adFolder = public_path("uploads/ads/{$ad->id}");
            $imagePaths = [];
            if (file_exists($adFolder)) {
                $files = scandir($adFolder);
                foreach ($files as $file) {
                    if ($file !== '.' && $file !== '..') {
                        $imagePaths[] = url("uploads/ads/{$ad->id}/{$file}");
                    }
                }
            }
    
            $adsWithImages[] = [
                'ad' => $ad,
                'images' => $imagePaths
            ];
        }
    
        return response()->json(['ads' => $adsWithImages], 200);
    }
    
   
    public function createAd(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'state_product_id' => 'required',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        $ad = Ads::create([
            'title' => $request->title,
            'description' => $request->description,
            'state_product_id' => $request->state_product_id,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'active' => 1, 
            'created_by' => Auth::id(), 
        ]);
    
        $adFolder = public_path("uploads/ads/{$ad->id}");
        if (!file_exists($adFolder)) {
            mkdir($adFolder, 0777, true); 
        }
    
        $imagePaths = [];
    
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imageName = time() . '-' . $image->getClientOriginalName();
                $image->move($adFolder, $imageName);
                $imagePaths[] = "uploads/ads/{$ad->id}/{$imageName}";
            }
        }
    

        $data = [
            'subject' => 'Anúncio Pendente',
            'message' => 'Olá, tem um anuncio pendente para aprovação.',
        ];
    
        Mail::send([], [], function ($message) use ($data) {
            $message->to('tadeucosta00@gmail.com')
                    ->subject($data['subject'])
                    ->setBody($data['message'], 'text/plain');
        });
    

        return response()->json([
            'message' => 'Anúncio criado com sucesso',
            'ad' => $ad,
            'images' => $imagePaths
        ], 201);
    }
    
    public function addAdsFavorites(Request $request)
    {
        $request->validate([
            'ad_id' => 'required|exists:ads,id', 
        ]);
    
        $userId = Auth::id();
    
        $favorite = AdsFavorite::where('user_id', $userId)
                                ->where('ad_id', $request->ad_id)
                                ->first();
    
        if ($favorite) {
            if ($favorite->active == 1) {
                $favorite->update(['active' => 0]);
                return response()->json(['message' => 'Anúncio removido dos favoritos'], 200);
            } else {
                $favorite->update(['active' => 1]);
                return response()->json(['message' => 'Anúncio adicionado aos favoritos'], 200);
            }
        }
    
        $favorite = AdsFavorite::create([
            'user_id' => $userId,
            'ad_id' => $request->ad_id,
            'active' => 1, 
        ]);
    
        return response()->json(['message' => 'Anúncio adicionado aos favoritos com sucesso', 'favorite' => $favorite], 201);
    }
    
    public function getMyAdsFavorites(Request $request)
    {
        $userId = Auth::id();
    
        $favorites = AdsFavorite::with('ad')
                                ->where('user_id', $userId)
                                ->where('active', 1)
                                ->get();
    
        if ($favorites->isEmpty()) {
            return response()->json(['message' => 'Nenhum anúncio favorito encontrado.'], 404);
        }

        foreach ($favorites as $favorite) {

            $adFolder = public_path("uploads/ads/{$favorite->ad_id}");
            $imagePaths = [];
    
            if (file_exists($adFolder)) {
                $files = scandir($adFolder);
                foreach ($files as $file) {
                    if ($file !== '.' && $file !== '..') {
                        $imagePaths[] = url("uploads/ads/{$favorite->ad_id}/{$file}");
                    }
                }
            }
    
            $adsWithImages[] = [
                'ad' => $favorite->ad,
                'images' => $imagePaths,
            ];
        }
    
        return response()->json(['favorites' => $adsWithImages], 200);
    }
    
    public function markAdSell(Request $request)
    {
        $request->validate([
            'ad_id' => 'required|exists:ads,id',
        ]);
    
        $adId = $request->input('ad_id');
    
        $ad = Ads::find($adId);
    
        if (!$ad) {
            return response()->json(['message' => 'Anúncio não encontrado.'], 404);
        }
    
        $soldStatusId = 3;
    
        if ($ad->status_id == $soldStatusId) {
            return response()->json(['message' => 'Este anúncio já está marcado como vendido.'], 400);
        }
    
        $ad->status_id = $soldStatusId;
        $ad->save();
    
        return response()->json(['message' => 'Anúncio marcado como vendido com sucesso.'], 200);
    }
    
    public function deleteAd(Request $request)
    {
        $request->validate([
            'ad_id' => 'required|exists:ads,id',
        ]);
    
        $adId = $request->input('ad_id');
    
        $ad = Ads::find($adId);
    
        if (!$ad) {
            return response()->json(['message' => 'Anúncio não encontrado.'], 404);
        }
    
        $desactiveStatusId = 4;
    
        if ($ad->status_id == $desactiveStatusId) {
            return response()->json(['message' => 'Este anúncio já está marcado como desativo.'], 400);
        }
    
        $ad->status_id = $desactiveStatusId;
        $ad->save();
    
        return response()->json(['message' => 'Anúncio marcado como vendido com desativo.'], 200);
    }

    
    public function getUserChats()
    {
        $userId = Auth::id();
    
        $chats = AdsChat::where('buyer_id', $userId)
            ->orWhere('seller_id', $userId)
            ->with(['ad', 'buyer', 'seller', 
            
            'messages' => function($query) {
                $query->latest()->limit(1);
            }])
            ->get();
    
        foreach ($chats as $chat) {
            $adFolder = public_path("uploads/ads/{$chat->ad_id}");
            $imagePaths = [];
    
            if (file_exists($adFolder)) {
                $files = scandir($adFolder);
                foreach ($files as $file) {
                    if ($file !== '.' && $file !== '..') {
                        $imagePaths[] = url("uploads/ads/{$chat->ad_id}/{$file}");
                    }
                }
            }
    
            $chat->img = $imagePaths[0] ?? null;
        }
    
        return response()->json([
            'chats' => $chats,
            'user_id' => $userId,
        ], 200);
    }
    


    public function createOrGetChat(Request $request)
    {
        $request->validate([
            'ad_id' => 'required|exists:ads,id',
            'seller_id' => 'required|exists:users,id',
        ]);

        $userId = Auth::id();
        $adId = $request->ad_id;
        $sellerId = $request->seller_id;


        $chat = AdsChat::where('ad_id', $adId)
            ->where(function ($query) use ($userId, $sellerId) {
                $query->where('buyer_id', $userId)
                    ->orWhere('seller_id', $userId)
                    ->orWhere('buyer_id', $sellerId)
                    ->orWhere('seller_id', $sellerId);
            })
            ->first();

        if (!$chat) {
            $chat = AdsChat::create([
                'ad_id' => $adId,
                'buyer_id' => $userId === $sellerId ? null : $userId, 
                'seller_id' => $sellerId,
            ]);
        }

        return response()->json([
            'chat_id' => $chat->id
        ], 200);
    }


    public function sendMessage(Request $request)
    {
        $request->validate([
            'chat_id' => 'required|exists:ads_chats,id',
            'message' => 'required|string|max:1000',
        ]);


        $message = AdsMessages::create([
            'chat_id' => $request->chat_id,
            'sent_by' => Auth::id(),
            'message' => $request->message,
            'date_time' => now(),
            'read' => false,
        ]);

        broadcast(new NewChatMessage($message))->toOthers();


        return response()->json([
            'message' => 'Mensagem enviada com sucesso!',
            'data' => $message
        ], 201);
    }

    public function getChatMessages($chatId)
    {
        $messages = AdsMessages::where('chat_id', $chatId)
            ->orderBy('date_time', 'asc')
            ->get();

        return response()->json([
            'messages' => $messages
        ], 200);
    }

    public function getChats()
    {
        $userId = Auth::id();    
        $chats = AdsChat::where('buyer_id', $userId)
            ->orWhere('seller_id', $userId)
            ->with([
                'ad',
                'buyer',
                'seller',
                'messages' => function ($query) {
                    $query->orderBy('date_time', 'desc')->limit(1); 
                }
            ])
            ->get();
    
        $formattedChats = $chats->map(function ($chat) {
            $lastMessage = $chat->messages->first();
            $userId = Auth::id();    

            return [
                'id' => $chat->id,
                'meu_id' => $userId,
                'ad_title' => $chat->ad->title ?? 'Anúncio removido',
                'price' => $chat->ad->price ?? 'N/A',
                'seller_id' => $chat->seller->id ,
                'seller_name' => $chat->seller->name ?? 'Vendedor desconhecido',
                'meu_id' => $chat->ad->title ?? 'Anúncio removido',
                'buyer_id' => $chat->buyer->id ?? 'Comprador desconhecido',
                'buyer_name' => $chat->buyer->name ?? 'Comprador desconhecido',
                'last_message' => $lastMessage ? $lastMessage->message : 'Sem mensagens',
                'images' => url("uploads/ads/{$chat->ad_id}/image1.jpg"),
            ];
        });
    
        return response()->json(['chats' => $formattedChats], 200);
    }
}

