import ProductCard from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { UmmahProduct } from "@/data/ummahProducts";

interface RelatedProductsCarouselProps {
  products: UmmahProduct[];
  title?: string;
}

const RelatedProductsCarousel = ({
  products,
  title = "More from Ummah Build",
}: RelatedProductsCarouselProps) => {
  if (products.length === 0) return null;

  return (
    <section aria-label={title}>
      <h2 className="mb-5 font-heading text-2xl font-bold text-foreground">{title}</h2>
      <Carousel
        opts={{ align: "start", loop: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {products.map((product) => (
            <CarouselItem key={product.slug} className="basis-[85%] pl-3 sm:basis-1/2 lg:basis-1/3">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {products.length > 1 && (
          <>
            <CarouselPrevious className="-left-2 top-[calc(50%-1rem)] hidden sm:flex md:-left-10" />
            <CarouselNext className="-right-2 top-[calc(50%-1rem)] hidden sm:flex md:-right-10" />
          </>
        )}
      </Carousel>
    </section>
  );
};

export default RelatedProductsCarousel;
