import { useMutation } from "@tanstack/react-query";
import type { ILoginUser, IAuthResponse } from "@repo/core"
import api from "../utils/api-client";

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: ILoginUser): Promise<IAuthResponse> => {
      const { data } = await api.post<IAuthResponse>(
        "/auth/login",
        credentials,
      )
      return data
    }
  })
}
