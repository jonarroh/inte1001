
  import { useRouteError } from "react-router-dom";

  export default function BadgesErrorPage() {
    const error = useRouteError() as Error;
    
    return (
      <div >
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
        <i>
            {/* 
            manejo de errores en la pagina de error hacer de esta manera
            */}
            {(error as Error)?.message ||
              (error as { statusText?: string })?.statusText}
          </i>
        </p>
      </div>
    );
  }