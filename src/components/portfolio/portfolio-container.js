//Este componente de clase ha sido modificado a componente funcional por chatgpt
import React, { useState, useEffect } from "react";
import axios from "axios";

import PortfolioItem from "./portfolio-item";

const PortfolioContainer = () => {
  const [pageTitle, setPageTitle] = useState("Welcome to my portfolio");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleFilter = (filter) => {
    if (filter === "CLEAR_FILTERS") {
      getPortfolioItems();
    } else {
      getPortfolioItems(filter);
    }
  };

  const getPortfolioItems = (filter = null) => {
    axios
      .get("https://jordan.devcamp.space/portfolio/portfolio_items")
      .then((response) => {
        if (filter) {
          setData(
            response.data.portfolio_items.filter((item) => {
              return item.category === filter;
            })
          );
        } else {
          setData(response.data.portfolio_items);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const portfolioItems = () => {
    return data.map((item) => {
      return <PortfolioItem key={item.id} item={item} />;
    });
  };

  useEffect(() => {
    getPortfolioItems();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="homepage-wrapper">
      <div className="filter-links">
        <button className="btn" onClick={() => handleFilter("eCommerce")}>
          eCommerce
        </button>
        <button className="btn" onClick={() => handleFilter("Scheduling")}>
          Scheduling
        </button>
        <button className="btn" onClick={() => handleFilter("Enterprise")}>
          Enterprise
        </button>
        <button className="btn" onClick={() => handleFilter("CLEAR_FILTERS")}>
          All
        </button>
      </div>
      <div className="portfolio-items-wrapper">{portfolioItems()}</div>
    </div>
  );
};

export default PortfolioContainer;
