import { Popover, Transition } from "@headlessui/react"
import React, { useState } from "react"
import {
  useFeaturedProductsQuery,
  useNavigationCollections,
} from "@lib/hooks/use-layout-data"

import Link from "next/link"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { chunk } from "lodash"
import clsx from "clsx"
import repeat from "@lib/util/repeat"
import { useAccount } from "@lib/context/account-context"
import { useRouter } from "next/router"

const DropdownMenu = () => {
  const [open, setOpen] = useState(false)
  const { push } = useRouter()
  const { data: collections, isLoading: loadingCollections } =
    useNavigationCollections()
  const { data: products, isLoading: loadingProducts } =
    useFeaturedProductsQuery()
  const { is_b2b } = useAccount()

  return (
    <>
      {is_b2b && (
        <div className="h-full flex">
          <Link href="/store" passHref>
            <a className="relative flex h-full">
              <span className="relative h-full flex items-center transition-all ease-out duration-200">
                Store
              </span>
            </a>
          </Link>
        </div>
      )}
      {!is_b2b && (
        <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="h-full"
      >
        <div className="flex items-center h-full">
          <Popover className="h-full flex">
            <>
              <Link href="/shop" passHref>
                <a className="relative flex h-full">
                  <Popover.Button
                    className={clsx(
                      "relative h-full flex items-center transition-all ease-out duration-200"
                    )}
                    onClick={() => push("/store")}
                  >
                    Store
                  </Popover.Button>
                </a>
              </Link>
              <Transition
                show={open}
                as={React.Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Popover.Panel
                  static
                  className="absolute top-full inset-x-0 text-sm text-gray-700 z-30 border-y border-gray-200"
                >
                  <div className="relative bg-white py-8">
                    <div className="flex items-start content-container">
                      <div className="flex flex-col flex-1 max-w-[30%]">
                        <h3 className="text-base-semi text-gray-900 mb-4">
                          Collections
                        </h3>
                        <div className="flex items-start">
                          {collections &&
                            chunk(collections, 6).map((chunk, index) => {
                              return (
                                <ul
                                  key={index}
                                  className="min-w-[152px] max-w-[200px] pr-4"
                                >
                                  {chunk.map((collection) => {
                                    return (
                                      <div key={collection.id} className="pb-3">
                                        <Link
                                          href={`/collections/${collection.id}`}
                                        >
                                          <a onClick={() => setOpen(false)}>
                                            {collection.title}
                                          </a>
                                        </Link>
                                      </div>
                                    )
                                  })}
                                </ul>
                              )
                            })}
                          {loadingCollections &&
                            repeat(6).map((index) => (
                              <div
                                key={index}
                                className="w-12 h-4 bg-gray-100 animate-pulse"
                              />
                            ))}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="grid grid-cols-3 gap-4">
                          {products?.slice(0, 3).map((product) => (
                            <ProductPreview {...product} key={product.id} />
                          ))}
                          {loadingProducts &&
                            repeat(3).map((index) => (
                              <SkeletonProductPreview key={index} />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          </Popover>
        </div>
      </div>
      )}
    </>
  )
}

export default DropdownMenu
