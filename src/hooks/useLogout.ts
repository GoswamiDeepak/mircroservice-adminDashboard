import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";
import { userAuthStore } from "../store";

export function useLogout () {
   const {logout:logoutFromStore} = userAuthStore()

   const { mutate: logoutMutate} = useMutation({
        mutationKey:['logout'],
        mutationFn: logout,
        onSuccess: () => {
            logoutFromStore()
            return;
        }
    })

    return {
        logoutMutate
    }
}