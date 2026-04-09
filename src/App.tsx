import { BrowserRouter as Router, Routes, Route } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./hooks/queryClient";
import { useTheme } from "./hooks/clientState/useTheme";
//import ThemeToggle from "./components/ToggleTheme";
import { useToken } from "./hooks/clientState/useToken";
import Home from "./pages/user/Home";
import SingleBlog from "./pages/user/SingleBlog";
import Blogs from "./pages/user/Blogs";
import FAQs from "./pages/user/FAQs";
import NotFoundPage from "./pages/NotFoundPage";
import ManageAccount from "./pages/user/ManageAccount";

function App() {
  useTheme();
  useToken();

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/faqs' element={<FAQs />} />
          <Route path='/blogs:id' element={<SingleBlog />} />
          <Route path='/manage-account' element={<ManageAccount />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              "bg-background text-foreground border border-border shadow-lg rounded-md",
            style: {
              background: "inherit",
              color: "inherit",
              padding: "12px 16px",
            },
          }}
        />
        {/* <ThemeToggle /> */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Router>
  );
}

export default App;
