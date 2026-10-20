import { ChefHat } from "lucide-react";
export function BrandLogo() {
  return (
    <a className="brand" href="/" aria-label="CV Foods home">
      <span className="brand-mark">
        <ChefHat size={20} />
      </span>
      <span>
        cv<span className="brand-light">foods</span>
        <small>GOOD FOOD, GOOD MOOD</small>
      </span>
    </a>
  );
}
