import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Footer from "./Footer";

describe("Footer", () => {
  it("renders the current year in the footer", () => {
    const currentYear = new Date().getFullYear();
    const { getByText } = render(<Footer />);

    expect(
      getByText(`© ${currentYear} | All rights reserved`)
    ).toBeInTheDocument();
  });
});
