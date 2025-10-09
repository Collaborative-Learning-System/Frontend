import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


const MySwal = withReactContent(Swal);


const AlertService = {
  
  showConfirm: async (
    message: string,
    title: string = "Are you sure?",
  ): Promise<boolean> => {
    const result = await MySwal.fire({
      title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    return result.isConfirmed;
  },
};

export default AlertService;
