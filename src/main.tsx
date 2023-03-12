// import React from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "antd/dist/reset.css";

// import App from './App'
import LayoutComponent from "./components/layout";

import SignInPage from "./pages/signin";
import HomePage from "./pages/home";
import PostListPage from "./pages/posts/list";
import PostDetailPage from './pages/posts/detail/index';
import PostEditPage from "./pages/posts/edit";
import IngredientListPage from "./pages/ingredient/list";
import IngredientEditPage from "./pages/ingredient/edit";
import IngredientSubTypeListPage from "./pages/ingredient-sub-types/list";
import IngredientSubTypeEditPage from "./pages/ingredient-sub-types/edit";
import IngredientTypeListPage from "./pages/ingredient-types/list";
import IngredientTypeEditPage from "./pages/ingredient-types/edit";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Routes>
        <Route path="/signin" element={<SignInPage />} />

        <Route path="/" element={<LayoutComponent />}>
            <Route path="home" element={<HomePage />} />
        </Route>

      <Route path="/posts" element={<LayoutComponent />}>
        <Route path="" element={<PostListPage />} />
        <Route path=":id" element={<PostDetailPage />} />
        <Route path="edit/:id?" element={<PostEditPage />} />
      </Route>

        <Route path="/ingredients" element={<LayoutComponent />}>
            <Route path="list" element={<IngredientListPage />} />
            <Route path="edit/id:?" element={<IngredientEditPage />} />
        </Route>

        <Route path="/ingredient-sub-types" element={<LayoutComponent />}>
            <Route path="list" element={<IngredientSubTypeListPage />} />
            <Route path="edit/:id?" element={<IngredientSubTypeEditPage />} />
        </Route>

        <Route path="/ingredient-types" element={<LayoutComponent />}>
            <Route path="list" element={<IngredientTypeListPage />} />
            <Route path="edit/:id?" element={<IngredientTypeEditPage />} />
        </Route>
    </Routes>
  </BrowserRouter>
);
