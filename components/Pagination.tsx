"use client";

import React from "react";
import { Button } from "./ui/button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  itemCount: number;
  pageSize: number;
  currentPage: number;
}

const Pagination = ({ itemCount, pageSize, currentPage }: Props) => {
  // calculate how many pages (page count) we needs based on number of itemCount and items per page (pageSize)
  const pageCount = Math.ceil(itemCount / pageSize);

  // use this and searchParams to identify current page for pagination
  const router = useRouter();
  const searchParams = useSearchParams();

  // don't show the pagination if pagecount (number of pages) is 1 or less. we don't need pagination for that.
  if (pageCount <= 1) return null;

  // getting the page url, parse in the 'page' parameter and page number
  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString()); // get the url and add e.g. page=1 or page=2 in the url
    router.push("?" + params.toString());
  };

  return (
    <div className="mt-4">
      <div>
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => changePage(1)}
        >
          <ChevronFirst />
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === pageCount}
          onClick={() => changePage(currentPage + 1)}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === pageCount}
          onClick={() => changePage(pageCount)}
        >
          <ChevronLast />
        </Button>
      </div>
      <div>
        <p>
          Page {currentPage} of {pageCount}
        </p>
      </div>
    </div>
  );
};

export default Pagination;
