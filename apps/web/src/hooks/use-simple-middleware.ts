import { useLocation, useNavigate } from "@tanstack/react-router";
import { useSessionAuthenticated } from "../stores/session";
import { useEffect } from "react";
import { toast } from "sonner";

export function useSimpleMiddleware() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAutenticated = useSessionAuthenticated()

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === '/auth' && isAutenticated) {
      toast.success('Login successful')
      navigate({to: '/tasks'})
    }

    if ((currentPath === '/tasks' || currentPath === '/tasks/$taskId') && !isAutenticated) {
      toast.warning('Sorry, please log in to continue.')
      navigate({to: '/auth'})
    }
  }, [location, navigate, isAutenticated])
}
