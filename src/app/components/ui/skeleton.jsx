import { cn } from "./utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gray-200 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

// Shop Page Skeleton
export function ShopPageSkeleton({ className }) {
  return (
    <div className={cn("container mx-auto px-4 lg:px-8 pb-24", className)}>
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="hidden lg:block w-72">
          <div className="h-96 bg-gray-100 animate-pulse rounded-2xl" />
        </aside>
        <div className="flex-grow">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
            {/* Mobile: 6 cards, Desktop: 9 cards */}
            {[...Array(9)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Skeleton
export function CartSkeleton({ className }) {
  return (
    <div className={cn("container mx-auto px-4 lg:px-8 py-12", className)}>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
        <div className="space-y-6">
          <div className="bg-gray-100 animate-pulse h-64 rounded-2xl" />
          <div className="bg-gray-100 animate-pulse h-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Account Skeleton
export function AccountSkeleton({ className }) {
  return (
    <div className={cn("container mx-auto px-4 lg:px-8 py-12", className)}>
      <div className="grid lg:grid-cols-[280px_1fr] gap-12">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-12 rounded-xl" />
          ))}
        </div>
        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
          <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <div className="bg-gray-100 animate-pulse h-6 w-48 rounded" />
            </div>
            <div className="divide-y divide-gray-100">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-6">
                  <div className="bg-gray-100 animate-pulse h-16 w-16 rounded-lg" />
                  <div className="flex-grow space-y-2">
                    <div className="bg-gray-100 animate-pulse h-4 w-3/4 rounded" />
                    <div className="bg-gray-100 animate-pulse h-3 w-1/2 rounded" />
                  </div>
                  <div className="bg-gray-100 animate-pulse h-8 w-20 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Card Skeleton
export function ProductCardSkeleton({ className }) {
  return (
    <div className={cn("bg-white rounded-lg overflow-hidden border border-gray-100", className)}>
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center gap-3 mt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

// Cart Item Skeleton
export function CartItemSkeleton({ className }) {
  return (
    <div className={cn("flex gap-4 p-4 bg-white border border-gray-100 rounded-lg", className)}>
      <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
      <div className="flex-grow space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-32" />
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

// Order Row Skeleton
export function OrderRowSkeleton({ className }) {
  return (
    <tr className={cn("border-b border-gray-50", className)}>
      <td className="px-8 py-6"><Skeleton className="h-4 w-24" /></td>
      <td className="px-8 py-6"><Skeleton className="h-4 w-32" /></td>
      <td className="px-8 py-6"><Skeleton className="h-6 w-20 rounded-full" /></td>
      <td className="px-8 py-6"><Skeleton className="h-4 w-16" /></td>
      <td className="px-8 py-6"><Skeleton className="h-8 w-20 rounded-lg" /></td>
    </tr>
  );
}

// Form Field Skeleton
export function FormFieldSkeleton({ className }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton({ className }) {
  return (
    <div className={cn("bg-white p-8 rounded-[32px] border border-gray-100", className)}>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

// Product Gallery Skeleton
export function ProductGallerySkeleton({ className }) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Skeleton className="aspect-square w-full rounded-[32px]" />
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-24 h-24 rounded-2xl flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}

// Checkout Form Skeleton
export function CheckoutFormSkeleton({ className }) {
  return (
    <div className={cn("space-y-10", className)}>
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <FormFieldSkeleton />
      </div>
      <div className="space-y-6 pt-10 border-t border-gray-100">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>
        <FormFieldSkeleton />
        <div className="grid grid-cols-3 gap-4">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>
      </div>
    </div>
  );
}

// Product Detail Skeleton
export function ProductDetailSkeleton({ className }) {
  return (
    <div className={cn("container mx-auto px-4 lg:px-8 py-12", className)}>
      <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
        {/* Left: image gallery */}
        <ProductGallerySkeleton />

        {/* Right: product info */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>

          {/* Size selector */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-12 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>

          {/* Add to cart button */}
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton };
