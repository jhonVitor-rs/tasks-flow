import type { IAuthResponse, IRegisterUser } from "@repo/core";
import { useMutation } from "@tanstack/react-query";
import api from "../utils/api-client";

export function useRegister() {
  return useMutation({
    mutationFn: async (credentials: IRegisterUser): Promise<IAuthResponse> => {
      const { data } = await api.post<IAuthResponse>(
        "/auth/register",
          credentials,
      )
      return data
    }
  })
}
