import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import Link from "next/link";


export default function ProductsPage() {
    const products = [
        {
            id: 1,
            name: "Product 1",
            price: 100,
        },
        {
            id: 2,
            name: "Product 2",
            price: 200,
        },
        {
            id: 3,
            name: "Product 3",
            price: 300,
        },
        {
            id: 4,
            name: "Product 4",
            price: 300,
        },
        {
            id: 5,
            name: "Product 5",
            price: 300,
        }
    ]

    return (
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
                <Card key={product.id} className="w-[250px] h-[340px] flex flex-col justify-between p-4 border-2 border-gray-300 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardHeader className="w-full h-[100px]">
                        <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="w-full h-[140px]">
                        <p className="text-sm text-gray-500">{product.price}</p>
                    </CardContent>
                    <CardFooter className="w-full h-[100px]">
                        <Button className="w-full" asChild>
                            <Link href={`/products/${product.id}`}>
                                <Eye className="w-4 h-4" />
                                View
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </section>
    );
}