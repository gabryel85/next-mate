### Konfiguracja środowiska

1. **Zainstaluj Node.js**: Upewnij się, że masz zainstalowaną najnowszą wersję Node.js (minimalna 18). Możesz to sprawdzić, wpisując **`node -v`** w terminalu.

### Tworzenie nowego projektu Next.js

1. **Utwórz nowy projekt**: W terminalu wpisz **`npx create-next-app@latest todo-next-app`**
2. **Przejdź do katalogu projektu**: **`cd todo-next-app`**.

### Konfiguracja Prisma

1. **Dodaj Prisma do projektu**: W terminalu projektu wpisz **`npm install prisma --save-dev`** oraz **`npx prisma init`**. To utworzy nowy katalog **`prisma`** oraz plik **`.env`** w katalogu głównym projektu.
2. **Zainstaluj klienta Prisma**: **`npm install @prisma/client`**.

> Prisma jest nowoczesnym narzędziem ORM (Object-Relational Mapping), które ułatwia budowanie aplikacji w JavaScript i TypeScript poprzez zapewnienie łatwego dostępu do bazy danych. Umożliwia modelowanie struktury bazy danych za pomocą Prisma Schema Language, automatycznie generuje bezpieczne i typowane zapytania do bazy danych, co znacznie przyspiesza proces tworzenia oprogramowania i pomaga uniknąć typowych błędów. Prisma wspiera wiele popularnych baz danych, takich jak PostgreSQL, MySQL, SQLite, i MongoDB, oferując jednolity interfejs do interakcji z różnymi systemami baz danych. Dzięki swojej wydajności, łatwości użycia i integracji z nowoczesnymi frameworkami JavaScript, Prisma stała się popularnym wyborem wśród deweloperów aplikacji webowych i mobilnych.

<br>

### Definiowanie schematu bazy danych

1. **Edytuj plik** **`prisma/schema.prisma`**
   <br>

```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id       Int        @id @default(autoincrement())
  name     String
  email    String     @unique
  todos    Todo[]
}

model Status {
  id       Int        @id @default(autoincrement())
  name     String
  todos    Todo[]
}

model Todo {
  id        Int       @id @default(autoincrement())
  title     String
  content   String?
  userId    Int
  user      User      @relation(fields: [userId], references: [id])
  statusId  Int
  status    Status    @relation(fields: [statusId], references: [id])
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

> [!info]
> Dyrektywy **`@relation`**, **`@default`**, i **`@updatedAt`** są kluczowymi elementami języka schematu Prisma, który jest używany do definiowania modeli i relacji w bazie danych w aplikacjach korzystających z ORM Prisma. Oto krótkie wyjaśnienie każdej z tych dyrektyw:

### @relation(fields: \[userId], references: \[id])

- **@relation** jest używana do określenia relacji między modelami w schemacie Prisma. Pozwala to Prisma na zrozumienie, jak modele są ze sobą powiązane, co jest kluczowe dla generowania odpowiednich zapytań SQL i obsługi relacji w kodzie aplikacji.
- **`fields: [userId]`** określa, które pole w bieżącym modelu jest używane do przechowywania klucza obcego relacji. W tym przypadku **`userId`** wskazuje, że pole to przechowuje identyfikator powiązanego użytkownika.
- **`references: [id]`** wskazuje, do którego pola w powiązanym modelu odnosi się klucz obcy. W tym przypadku odnosi się do pola **`id`** w modelu użytkownika, co oznacza, że **`userId`** w bieżącym modelu jest kluczem obcym, który odnosi się do klucza głównego **`id`** w modelu użytkownika.

### @default(now())

- **@default** określa domyślną wartość dla pola w modelu, jeśli wartość nie jest podana podczas tworzenia rekordu.
- **`now()`** jest funkcją używaną jako wartość domyślna dla pól daty/czasu, co oznacza, że jeśli nowy rekord jest tworzony bez określonej wartości dla tego pola, Prisma automatycznie użyje bieżącej daty i czasu (według zegara serwera bazy danych) jako wartości dla tego pola.

### @updatedAt

- **@updatedAt** jest specjalną dyrektywą używaną w polach daty/czasu, która automatycznie aktualizuje wartość pola na bieżącą datę i czas, kiedy rekord jest aktualizowany. Dzięki temu można łatwo śledzić, kiedy dany rekord został ostatnio zmodyfikowany, bez konieczności ręcznego aktualizowania tego pola w każdej operacji aktualizacji.

> [!note]
> Te dyrektywy znacznie ułatwiają modelowanie i obsługę złożonych relacji oraz automatyzację wspólnych zadań związanych z zarządzaniem danymi, takich jak śledzenie czasu utworzenia i aktualizacji rekordów.

### Tworzenie pliku lib/prisma.js:

Aby uniknąć wielokrotnego tworzenia instancji Prisma Client, co może być nieefektywne i prowadzić do problemów z wydajnością. Zamiast tego, tworzy się pojedynczą instancję Prisma Client i eksportuje ją z pliku w katalogu **`lib`** lub **`utils`**, a następnie importuje tam, gdzie jest potrzebna.

```javascript
import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient();
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}

export { prisma };
```

> [!info]
> Ten wzorzec zapewnia, że w środowisku deweloperskim używana jest jedna, globalna instancja Prisma Client, co pomaga w optymalizacji użycia zasobów i połączeń z bazą danych. W produkcji, gdzie globalny obiekt nie jest dostępny lub jego użycie może prowadzić do problemów z izolacją kontekstu, tworzona jest nowa instancja dla każdego żądania.

<br>

### Konfiguracja bazy danych PostgreSQL na Render.com

1. **Utwórz konto na Render.com** i zaloguj się.
2. **Utwórz nową bazę danych PostgreSQL**: W panelu Render przejdź do sekcji "Databases" i utwórz nową bazę danych. Po utworzeniu otrzymasz dane dostępowe, w tym URL.
3. **Zaktualizuj plik** **`.env`**: Dodaj swoje dane dostępowe do bazy danych PostgreSQL w pliku **`.env`** projektu, używając zmiennej **`DATABASE_URL`**. Przykład: **`DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?schema=public"`**.

> [!warning]
> Aby zobaczyć tabele PostgreSQL hostowane na Render.com, musisz skorzystać z narzędzia do zarządzania bazą danych, które pozwoli Ci na połączenie się z bazą danych i przeglądanie jej zawartości.

### Użyj psql

**`psql`** to narzędzie wiersza poleceń dla PostgreSQL, które pozwala na interakcję z bazą danych. Aby użyć **`psql`** do połączenia się z bazą danych na Render.com, potrzebujesz danych dostępowych do swojej bazy danych, które znajdziesz w panelu zarządzania Render.com.

1. **Znajdź dane dostępowe do bazy danych**: Zaloguj się do swojego konta na Render.com, przejdź do sekcji "Databases", wybierz swoją bazę danych PostgreSQL i znajdź dane dostępowe, w tym host, port, nazwę bazy danych, użytkownika i hasło.
2. **Połącz się z bazą danych**: Otwórz terminal i użyj poniższego polecenia, zastępując odpowiednie wartości danymi dostępowymi:
   ```powershell
   psql -h <host> -p <port> -U <user> -d <database_name>
   ```
   Będziesz musiał wprowadzić hasło, gdy zostaniesz o to poproszony.
3. **Przeglądaj tabele**: Po pomyślnym połączeniu możesz użyć polecenia SQL, aby zobaczyć listę tabel w bieżącej bazie danych:

```
\dt
```

> [!success] > **Wygeneruj tabele w bazie danych**: Uruchom **`npx prisma migrate dev --name init`** w terminalu w głównym katalogu projektu, aby zastosować schemat do bazy danych.

## Użycie skryptu seedującego Prisma

1. **Utwórz skrypt seedujący**: W katalogu głównym projektu utwórz plik seed, np. **`prisma/seed.js`** który będzie zawierał logikę dodawania startowych danych do bazy.
2. **Dodaj logikę seedującą**: W pliku seedowym, użyj Prisma Client do dodania danych do tabel.&#x20;

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	const user1 = await prisma.user.create({
		data: {
			name: 'Alice',
			email: 'alice@example.com',
		},
	});

	const user2 = await prisma.user.create({
		data: {
			name: 'Bob',
			email: 'bob@example.com',
		},
	});

	const statusActive = await prisma.status.create({
		data: {
			name: 'Active',
		},
	});

	const statusCompleted = await prisma.status.create({
		data: {
			name: 'Completed',
		},
	});

	// Tworzenie zadań (todos)
	const todo1 = await prisma.todo.create({
		data: {
			title: 'Finish Prisma setup',
			content: 'Make sure Prisma is fully set up and ready to go.',
			userId: user1.id,
			statusId: statusActive.id,
		},
	});

	const todo2 = await prisma.todo.create({
		data: {
			title: 'Learn Next.js',
			content: 'Follow the official Next.js tutorial to understand the basics.',
			userId: user2.id,
			statusId: statusCompleted.id,
		},
	});

	console.log({ user1, user2, statusActive, statusCompleted, todo1, todo2 });
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
```

**Dodaj skrypt do package.json**: Aby łatwo uruchamiać skrypt seedujący, możesz dodać skrypt do pliku **`package.json`**:

```javascript
"scripts": {
  "prisma:seed": "node prisma/seed.js",
	"prisma:generate": "prisma generate"
}
```

Uruchom komendę:

```
npm run prisma:generate
```

> Polecenie **`prisma generate`** jest kluczowym elementem pracy z Prisma, narzędziem ORM (Object-Relational Mapping) dla Node.js i TypeScript. Oto, co robi **`prisma generate`**:
>
> 1. **Generuje Prisma Client**: Na podstawie definicji modeli w pliku **`schema.prisma`**, **`prisma generate`** tworzy Prisma Client - typowany klient bazy danych, który umożliwia wykonywanie operacji na bazie danych (takich jak zapytania, wstawianie, aktualizacje, usuwanie) w sposób bezpieczny typowo i wygodny dla programisty. Klient ten jest generowany jako zestaw plików w **`node_modules/@prisma/client`**, co pozwala na łatwe importowanie i używanie go w projekcie.
> 2. **Zapewnia bezpieczeństwo typów**: Dzięki generowaniu kodu na podstawie schematu, Prisma Client zapewnia silne typowanie operacji na bazie danych. Oznacza to, że każde zapytanie jest sprawdzane pod kątem zgodności z modelem danych, co minimalizuje ryzyko błędów związanych z niezgodnością typów czy odwołaniami do nieistniejących pól czy tabel.
> 3. **Ułatwia rozwój i refaktoryzację**: Ponieważ Prisma Client jest generowany automatycznie, każda zmiana w schemacie bazy danych (np. dodanie nowego pola do modelu) może być szybko odzwierciedlona w kodzie klienta przez ponowne uruchomienie **`prisma generate`**. To sprawia, że proces rozwijania aplikacji i refaktoryzacji schematu bazy danych staje się znacznie łatwiejszy i bezpieczniejszy.
> 4. **Integracja z narzędziami deweloperskimi**: Generowany Prisma Client jest w pełni zintegrowany z popularnymi środowiskami programistycznymi (IDE), takimi jak Visual Studio Code, oferując autouzupełnianie kodu, podpowiedzi typów i inne funkcje ułatwiające pracę z bazą danych.
> 5. **Wsparcie dla różnych baz danych**: **`prisma generate`** potrafi generować klientów dostosowanych do specyfikacji różnych systemów zarządzania bazami danych (RDBMS i nie tylko), takich jak PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, dzięki czemu Prisma Client może być używany w różnorodnych projektach.
>
> Podsumowując, **`prisma generate`** automatycznie tworzy Prisma Client na podstawie schematu bazy danych zdefiniowanego w **`schema.prisma`**, co znacząco upraszcza i usprawnia proces budowania i utrzymania aplikacji korzystających z bazy danych.

&#x20;

**Uruchom skrypt seedujący**: W terminalu, w katalogu głównym projektu, uruchom skrypt seedujący:

```
npm run prisma:seed
```

## NEXT API

### Struktura folderów dla API

W projekcie Next.js, endpointy API są tworzone w katalogu **`pages/api`**. Dla każdego modelu (**`User`**, **`Status`**, **`Todo`**), możesz utworzyć osobny podkatalog, który będzie zawierał pliki obsługujące różne metody HTTP (GET, POST, PUT, DELETE)

```
pages/
  api/
    users/
      index.js      // Dla operacji GET (list) i POST (create)
      [id].js       // Dla operacji GET (single), PUT (update), DELETE
    statuses/
      index.js
      [id].js
    todos/
      index.js
      [id].js
```

<br>

> [!info]
> W Next.js, handler łapie poszczególne żądania HTTP poprzez sprawdzenie metody żądania (**`req.method`**) i na tej podstawie wywołuje odpowiednią logikę dla danej metody. Na przykład, wewnątrz funkcji handlera możesz użyć instrukcji warunkowej **`if`** lub **`switch`**, aby rozróżnić metody żądań, takie jak **`GET`**, **`POST`**, **`PUT`**, **`DELETE`**, i odpowiednio na nie reagować, wykonując różne operacje dla każdej z nich.

### Implementacja endpointów

Każdy plik w katalogu **`api`** będzie obsługiwał różne żądania HTTP związane z jego modelem. Oto przykład implementacji dla modelu **`Todo`**:

**`pages/api/todos/index.js`**

```javascript
import { prisma } from '@/lib/prisma';

export async function get(req, res) {
	const todos = await prisma.todo.findMany();
	res.status(200).json(todos);
}

export async function post(req, res) {
	const { title, content, userId, statusId } = req.body;
	const newTodo = await prisma.todo.create({
		data: {
			title,
			content,
			userId,
			statusId,
		},
	});
	res.status(201).json(newTodo);
}

export default function handler(req, res) {
	if (req.method === 'GET') {
		get(req, res);
	} else if (req.method === 'POST') {
		post(req, res);
	} else {
		res.setHeader('Allow', ['GET', 'POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
```

**`pages/api/todos/[id].js`**

```javascript
import { prisma } from '@/lib/prisma';

// GET api/todos/:id
export async function get(req, res) {
	const { id } = req.query;
	const todo = await prisma.todo.findUnique({
		where: { id: parseInt(id) },
	});
	res.status(200).json(todo);
}

// PUT api/todos/:id
export async function put(req, res) {
	const { id } = req.query;
	const { title, content, userId, statusId } = req.body;
	const updatedTodo = await prisma.todo.update({
		where: { id: parseInt(id) },
		data: {
			title,
			content,
			userId,
			statusId,
		},
	});
	res.status(200).json(updatedTodo);
}

// DELETE api/todos/:id
export async function del(req, res) {
	const { id } = req.query;
	await prisma.todo.delete({
		where: { id: parseInt(id) },
	});
	res.status(204).end();
}

export default function handler(req, res) {
	switch (req.method) {
		case 'GET':
			get(req, res);
			break;
		case 'PUT':
			put(req, res);
			break;
		case 'DELETE':
			del(req, res);
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
			res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
```

### Endpoint /api/users

Utwórz plik **`pages/api/users/index.js`**:

```javascript
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const users = await prisma.user.findMany();
			res.status(200).json(users);
		} catch (error) {
			res.status(500).json({ message: 'Something went wrong', error: error.message });
		}
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
```

### Endpoint /api/statuses

Utwórz plik **`pages/api/statuses/index.js`**:

```javascript
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const statuses = await prisma.status.findMany();
			res.status(200).json(statuses);
		} catch (error) {
			res.status(500).json({ message: 'Something went wrong', error: error.message });
		}
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
```

> [!success]
> Co zrobić aby przetestować API z next?

> [!note]
> Możemy skorzystać z takich narzędzi jak Postman, Insomnia lub wtyczki do VSC **Thunder Client**

> [!danger]
> Adresy endpointów zaczynają się /api/ tak jak struktura katalogów w projekcie

> Aby dane przychodzące z żądania GET zawierały pełne obiekty dla **`user`** i **`status`**, zamiast tylko ich identyfikatorów (**`userId`**, **`statusId`**), możesz skorzystać z funkcjonalności Prisma Clienta zwaną "eager loading". Pozwala to na ładowanie powiązanych danych poprzez zagnieżdżone zapytania, co eliminuje potrzebę ręcznego łączenia danych na poziomie aplikacji.

```javascript
export async function get(req, res) {
	const todos = await prisma.todo.findMany({
		include: {
			user: true,
			status: true,
		},
	});
	res.status(200).json(todos);
}
```

# NEXT VIEW

### Strona listy zadań

1. **Dodanie do pliku** **`.env`**

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

1. Instalacja `axios`

```
npm install axios
```

1. Instalacja `swr`

```
npm i swr
```

> SWR jest biblioteką do pobierania danych stworzoną przez Vercel, zaprojektowaną z myślą o aplikacjach React i Next.js. Nazwa SWR pochodzi od strategii cache invalidation: "Stale-While-Revalidate", co oznacza "przestarzałe podczas użycia, odświeżaj w tle". Ta strategia pozwala na natychmiastowe wyświetlanie interfejsu użytkownika z potencjalnie przestarzałymi danymi z pamięci podręcznej, jednocześnie ponownie walidując te dane w tle i odświeżając je, gdy tylko najnowsze informacje staną się dostępne.

### Główne cechy SWR:

- **Optymalizacja wydajności i szybkość**: Dzięki strategii cache-first SWR pozwala na szybkie ładowanie danych, wykorzystując dane z pamięci podręcznej, co znacząco poprawia wydajność aplikacji.
- **Automatyczne ponowne żądania**: SWR automatycznie ponownie wykonuje żądania w tle, aby dane były zawsze aktualne, wykorzystując mechanizmy takie jak focus revalidation (ponowna walidacja przy ponownym skupieniu na oknie) czy interval polling (cykliczne odpytywanie).
- **Wbudowane zarządzanie stanem**: SWR zarządza stanem danych, stanem ładowania i błędami bez konieczności dodatkowego kodu czy użycia zewnętrznych bibliotek stanu.
- **Łatwość użycia**: Prosty interfejs API SWR sprawia, że jest on łatwy w użyciu, nawet dla początkujących programistów, jednocześnie oferując zaawansowane opcje konfiguracji dla bardziej skomplikowanych przypadków użycia.
- **Wsparcie SSR (Server-Side Rendering)**: SWR wspiera renderowanie po stronie serwera w Next.js, co pozwala na przyspieszenie pierwszego ładowania strony i poprawę SEO.

<br>

---

**Strona główna /pages/index.js**

```javascript
import Link from 'next/link';

export default function Home() {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden'>
				<img
					className='w-full h-56 object-cover object-center'
					src='https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
					alt='Todo List'
				/>
				<div className='p-4'>
					<h2 className='text-2xl font-bold text-center mb-4'>Todo List</h2>
					<p className='text-gray-600 text-center mb-8'>Organize your tasks efficiently</p>
					<div className='flex justify-center'>
						<Link href='/todos'>
							<span className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
								View Todo List
							</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
```

<br>

1. **Strona listy zadań (`pages/todos/index.js`)**: Ta strona będzie wyświetlać listę wszystkich zadań.

```json
import Link from 'next/link';
import axios from 'axios';

export default function Home({ todos }) {
	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Todo List</h1>
			<Link href='/todos/new'>
				<span className='mb-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors'>
					Add Todo
				</span>
			</Link>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{todos.map(todo => (
					<div
						key={todo.id}
						className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
						<div className='p-4'>
							<h2 className='text-lg font-semibold text-blue-500 hover:text-blue-600 transition-colors'>
								<Link href={`/todos/${todo.id}`}>
									<span>{todo.title}</span>
								</Link>
							</h2>
							<p className='text-gray-700'>{todo.content}</p>
						</div>
						<div className='px-4 py-2 bg-gray-100'>
							<Link href={`/todos/${todo.id}`}>
								<span className='text-sm text-blue-500 hover:text-blue-600 transition-colors'>View Details &rarr;</span>
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/todos`);
	const todos = res.data;

	return {
		props: { todos },
	};
}

```

> [!info]
> Lub alternatywnie możemy zamiast używać API, w `getServerSideProps` użyć bezpośredniego wywołania z PRISMA

```javascript
import { prisma } from '@/lib/prisma';
import useSWR from 'swr';
import Head from 'next/head';

// Funkcja do pobierania danych po stronie klienta (opcjonalnie, jeśli potrzebujesz aktualizacji w czasie rzeczywistym)
const fetcher = url => fetch(url).then(res => res.json());

export default function TodoDetails({ todo }) {
	// Użyj SWR do aktualizacji danych w czasie rzeczywistym, jeśli jest to wymagane
	const { data } = useSWR(`/api/todos/${todo.id}`, fetcher, { initialData: todo });

	return (
		<>
			<Head>
				<title>{data.title}</title>
			</Head>
			<div className='container mx-auto p-4'>
				<h1 className='text-2xl font-bold mb-4'>{data.title}</h1>
				<p>{data.content}</p>
				<p className='mt-2'>Status: {data.status.name}</p>
				<p>Assigned to: {data.user.name}</p>
			</div>
		</>
	);
}

// SSR: Ładowanie danych zadania po stronie serwera
export async function getServerSideProps(context) {
	const { id } = context.params;
	const todo = await prisma.todo.findUnique({
		where: { id: parseInt(id) },
		include: {
			user: true,
			status: true,
		},
	});

	return {
		props: { todo: JSON.parse(JSON.stringify(todo)) },
	};
}
```

<br>

### Formularz Todo (components/TodoForm.js)

Komponent **`TodoForm`** będzie używany zarówno do dodawania nowych zadań, jak i aktualizacji istniejących.

```javascript
// components/TodoForm.js
import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

export default function TodoForm({ onSubmit, initialData = {} }) {
	const { data: users } = useSWR('/api/users', fetcher);
	const { data: statuses } = useSWR('/api/statuses', fetcher);

	const [formData, setFormData] = useState({
		title: initialData.title || '',
		content: initialData.content || '',
		userId: initialData.userId || '',
		statusId: initialData.statusId || '',
	});

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = e => {
		e.preventDefault();
		const dataToSubmit = {
			...formData,
			userId: parseInt(formData.userId, 10),
			statusId: parseInt(formData.statusId, 10),
		};
		onSubmit(dataToSubmit);
	};

	return (
		<div className='max-w-xl mx-auto p-4 bg-white rounded-lg shadow-md text-gray-700'>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='title' className='block text-sm font-medium text-gray-700'>
						Title
					</label>
					<input
						type='text'
						id='title'
						name='title'
						value={formData.title}
						onChange={handleChange}
						required
						className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
					/>
				</div>
				<div>
					<label htmlFor='content' className='block text-sm font-medium text-gray-700'>
						Content
					</label>
					<textarea
						id='content'
						name='content'
						value={formData.content}
						onChange={handleChange}
						rows='4'
						className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'></textarea>
				</div>
				<div>
					<label htmlFor='userId' className='block text-sm font-medium text-gray-700'>
						User
					</label>
					<select
						id='userId'
						name='userId'
						value={formData.userId}
						onChange={handleChange}
						required
						className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'>
						<option value=''>Select a user</option>
						{users?.map(user => (
							<option key={user.id} value={user.id}>
								{user.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor='statusId' className='block text-sm font-medium text-gray-700'>
						Status
					</label>
					<select
						id='statusId'
						name='statusId'
						value={formData.statusId}
						onChange={handleChange}
						required
						className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'>
						<option value=''>Select a status</option>
						{statuses?.map(status => (
							<option key={status.id} value={status.id}>
								{status.name}
							</option>
						))}
					</select>
				</div>
				<button type='submit' className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700'>
					Submit
				</button>
			</form>
		</div>
	);
}
```

### Strona szczegółów zadania (pages/todos/\[id].js)

Strona ze szczegółami zadania będzie wykorzystywać dynamiczny routing Next.js do wyświetlania informacji o konkretnym zadaniu oraz formularza do jego aktualizacji.

```javascript
import axios from 'axios';
import TodoForm from '@/components/TodoForm';
import { useRouter } from 'next/router';

export default function TodoDetails({ todo }) {
	const router = useRouter();

	const handleSubmit = async data => {
		await fetch(`/api/todos/${todo.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		router.push('/todos');
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-xl font-bold mb-4'>Edit Todo</h1>
			<TodoForm onSubmit={handleSubmit} initialData={todo} />
		</div>
	);
}

export async function getServerSideProps({ params }) {
	const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${params.id}`);
	const todo = res.data;

	return {
		props: { todo },
	};
}
```

### Strona dodawania nowego zadania (pages/todos/new.js)

```javascript
import TodoForm from '@/components/TodoForm';
import { useRouter } from 'next/router';

export default function NewTodo() {
	const router = useRouter();

	const handleSubmit = async data => {
		await fetch(`/api/todos`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		router.push('/todos');
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-xl font-bold mb-4'>Add New Todo</h1>
			<TodoForm onSubmit={handleSubmit} />
		</div>
	);
}
```

<br>

# Podsumowanie

W aplikacjach Next.js istnieją różne metody generowania stron, które można wykorzystać do różnych celów, w zależności od wymagań aplikacji. Dwie główne metody to Server-Side Rendering (SSR) i Static Site Generation (SSG), a także istnieje możliwość korzystania z klienta HTTP, takiego jak SWR, do dynamicznego pobierania danych po stronie klienta. Oto krótkie omówienie tych metod i jak zostały wykorzystane w aplikacji:

### Server-Side Rendering (SSR) - getServerSideProps

SSR polega na generowaniu każdej strony na żądanie po stronie serwera. W Next.js, SSR jest realizowane za pomocą funkcji **`getServerSideProps`**, która uruchamia się przy każdym żądaniu do danej strony. Dzięki temu, dane są zawsze aktualne, ale każde żądanie wymaga więcej czasu na przetworzenie, ponieważ strona jest generowana na serwerze w czasie rzeczywistym.

> [!info]
> W aplikacji, SSR został wykorzystany do pobierania listy zadań (**`todos`**) na stronie głównej oraz szczegółów poszczególnych zadań. Dzięki temu, użytkownik od razu po wejściu na stronę otrzymuje aktualne dane, co jest szczególnie ważne dla dynamicznie zmieniających się treści.

<br>

### Static Site Generation (SSG) - getStaticProps

SSG polega na generowaniu statycznych wersji stron podczas budowania aplikacji. Strony te są potem serwowane bezpośrednio z pamięci cache, co znacznie przyspiesza czas ładowania. W Next.js, SSG jest realizowane za pomocą funkcji **`getStaticProps`** (i opcjonalnie **`getStaticPaths`** dla dynamicznych tras).

> [!info]
> W aplikacji nie opisano bezpośredniego użycia SSG, ale jest to metoda szczególnie przydatna dla stron, których zawartość nie zmienia się często, lub dla blogów, dokumentacji itp.

<br>

### SWR

SWR to biblioteka klienta HTTP stworzona przez Vercel, zaprojektowana do łatwego pobierania danych w aplikacjach React, w tym Next.js. SWR automatycznie zarządza cache'owaniem, ponownymi żądaniami i synchronizacją danych, co sprawia, że jest idealna do pobierania danych, które mogą się zmieniać, ale nie wymagają odświeżania całej strony.

> [!info]
> W aplikacji, SWR został wykorzystany do dynamicznego ładowania listy użytkowników i statusów w formularzu dodawania/edycji zadań. Dzięki temu, formularz może dynamicznie reagować na zmiany w danych bez konieczności odświeżania całej strony lub ponownego generowania strony po stronie serwera.

\
