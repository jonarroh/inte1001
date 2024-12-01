import { command, run, string, positional } from 'cmd-ts';
import chalk from 'chalk';
//@ts-ignore
import path from 'path';
//@ts-ignore
import fs from 'fs/promises';
//@ts-ignore
import process from 'process';

async function createFolder(name: string) {
  const folderPath = path.join(process.cwd(), 'src', 'pages', name);
  
  try {
    await fs.access(folderPath);
    console.error(chalk.red(`La carpeta ${name} ya existe`));
    return;
  } catch {
    // console.log(chalk.red(`error fatal contacte con brenda para solucionar el problema`));
  }

  await fs.mkdir(folderPath, { recursive: true });
  console.log(chalk.green(`Carpeta ${name} creada`));

  const capitalName = name.charAt(0).toUpperCase() + name.slice(1);

  // Creamos el archivo page.tsx
  const pageContent = `
  export default function ${capitalName}Page() {
  return (
    <div>page</div>
 )
 } `;
  await fs.writeFile(path.join(folderPath, 'page.tsx'), pageContent);
  console.log(chalk.green(`Archivo ${name}/page.tsx creado`));

  // Creamos el archivo service.ts
  const serviceContent = `
  import { sendRequest } from "../../lib/sendRequest";
  import { inser${capitalName} } from "@server/schema/${name}";

  export class ${capitalName}Service {
    private baseUrl: string = "http://191.101.1.86:3000/${name}";

    async create${capitalName}(new${capitalName}: FormData): Promise<inser${capitalName} | { success: false; error: any }
    > {
      const ${name}: inser${capitalName} = this.extract${capitalName}Data(new${capitalName});
      return sendRequest("POST", this.baseUrl, ${name});
    }
    
    async delete${capitalName}(id: number): Promise<void> {
      await sendRequest("DELETE", \`\${this.baseUrl}/\${id}\`);
    }

    async update${capitalName}(${name}: inser${capitalName}, id: number): Promise<inser${capitalName} | { success: false; error: any }
    > {
      return sendRequest("PUT", \`\${this.baseUrl}/\${id}\`, ${name});
    }

    private extract${capitalName}Data(formData: FormData): inser${capitalName} {
      return {
        //poner los campos de la entidad
      };
    }
  }`;
  await fs.writeFile(path.join(folderPath, 'service.ts'), serviceContent);
  console.log(chalk.green(`Archivo ${name}/service.ts creado`));

  // Creamos el archivo hooks.ts
  const hooksContent = `
  import { useState, useEffect } from "react";

  export function use${capitalName}() {
    const [${name}s, set${capitalName}s] = useState([]);

    useEffect(() => {
      //llamar a la api para obtener los datos
    }, []);

    return { ${name}s };
  }`;
  await fs.writeFile(path.join(folderPath, 'hooks.ts'), hooksContent);
  console.log(chalk.green(`Archivo ${name}/hooks.ts creado`));

  // Creamos el archivo errors.tsx
  const errorsContent = `
  import { useRouteError } from "react-router-dom";

  export default function ${capitalName}ErrorPage() {
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
  }`;
  await fs.writeFile(path.join(folderPath, 'error.tsx'), errorsContent);
  console.log(chalk.green(`Archivo ${name}/error.tsx creado`));

  // Creamos la carpeta children
  const childrenPath = path.join(folderPath, 'children');
  await fs.mkdir(childrenPath);
  console.log(chalk.green(`Carpeta ${name}/children creada`));

  // Creamos el archivo children/actions.ts
  const actionsContent = `
  import { ActionFunction, json, redirect } from "react-router-dom";

  export const Action${capitalName}Delete: ActionFunction = async ({ params }) => {
    return redirect("/${name}");
  }

  export const Action${capitalName}Update: ActionFunction = async ({ request }) => {
    return redirect("/${name}");
  }

  export const Action${capitalName}Create: ActionFunction = async ({ request }) => {
    return redirect("/${name}");
  };
  `;
  await fs.writeFile(path.join(childrenPath, 'actions.ts'), actionsContent);
  console.log(chalk.green(`Archivo ${name}/children/actions.ts creado`));

  console.log(chalk.green(`Página ${name} creada con éxito`));
}

const create = command({
  name: 'create',
  args: {
    name: positional({ type: string }),
  },
  async handler({ name }) {
    console.log(chalk.green(`Creando página ${chalk.yellow.bold(name)}`));
    // Si el name solo acepta letras minúsculas, guion medio y no debe tener espacios
    if (/[^a-z-]/.test(name)) {
      console.error(chalk.red('El nombre solo puede contener letras minúsculas y guiones medios, sin espacios.'));
      return;
    }

    await createFolder(name);
  },
});

// @ts-ignore
run(create, process.argv.slice(2));
