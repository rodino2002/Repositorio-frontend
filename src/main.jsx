
import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { Routers } from '../src/components/routes/index.routes';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { AuthProvider } from './Context/auth.context'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Routers />
    </AuthProvider>
  </QueryClientProvider>
);