# Система управління бібліотекою

Клієнтський застосунок на TypeScript **без фреймворків** (React/Vue/Angular не
використовуються) — увесь UI генерується та оновлюється програмно через DOM API.
`index.html` містить лише `<div id="app"></div>` і `<script>`, ніякої декларативної розмітки.

## Стек

- TypeScript (класи, інтерфейси, generics, namespace)
- Webpack 5 + ts-loader (збірка й dev-сервер)
- Bootstrap 5 (підключений через npm/webpack, без CDN у `index.html`)
- Mocha + Chai (юніт-тести)
- ESLint + Prettier (стиль коду)
- Husky (pre-commit хук: лінтер + тести)

## Запуск

```bash
npm install
npm start        # dev-сервер на http://localhost:9000
npm run build     # продакшн-збірка у dist/
npm test          # юніт-тести (Mocha + Chai)
npm run lint       # ESLint
npm run format     # Prettier --write
```

## Архітектура (за шарами відповідальності)

```
src/
├── models/            # Book, User + інтерфейси IBook, IUser — чисті дані, без UI/storage
│   └── interfaces/
├── services/
│   ├── Library.ts        # generic-клас Library<T extends { id: string }>
│   ├── Storage.ts         # обгортка над LocalStorage
│   ├── NotificationService.ts  # toast-сповіщення (без window.alert)
│   └── AppController.ts   # бізнес-логіка: валідація, borrow/return, персист, пагінація
├── utils/
│   ├── validators.ts      # namespace Validation { required, isYear, isUserId, isEmail }
│   └── idGenerator.ts
├── ui/                 # єдиний шар, що працює з DOM
│   ├── components/       # BookForm, UserForm, BookList, UserList, Modal, Pagination
│   └── render.ts          # точка монтування / повного перемальовування #app
├── types/index.ts      # спільні типи (FormResult, OperationResult, PaginatedResult<T>)
└── index.ts            # точка входу

tests/
├── library.test.ts     # тести Library<T>: add/remove/findById/find
└── validation.test.ts  # тести Validation: required/isYear/isUserId/isEmail
```

Принцип потоку даних: `AppController` нічого не знає про DOM. Після кожної зміни стану
він викликає `onUpdate()` — callback, на який підписується `index.ts`
(`controller.onUpdate = () => renderApp(controller)`), і весь `#app` перемальовується
заново. Це найпростіший надійний підхід без фреймворку для застосунку такого масштабу.

## Що реалізовано з вимог лабораторної

- Класи/інтерфейси `Book`/`IBook`, `User`/`IUser` з гетерами/сетерами
- Generic-клас `Library<T>` (додавання, видалення, пошук за id/предикатом)
- Клас `Storage` (save/load/remove/clear над LocalStorage), дані переживають перезавантаження
- `namespace Validation` — обов'язкові поля, рік видання (регулярка + перевірка на майбутнє),
  ID користувача (лише цифри), email
- Позичання/повернення книги, ліміт 3 книги на користувача, модальне вікно при перевищенні
- Сповіщення без `alert`: toast для другорядних подій, модальні вікна для
  позичання/повернення (як на прикладах дизайну)
- Пошук книг за назвою/автором, пагінація (5 елементів на сторінку) для книг і користувачів
- Видалення книг і користувачів (з підтвердженням через модальне вікно)
- ESLint + Prettier без попереджень, 19 юніт-тестів (Mocha/Chai) — усі проходять
- Husky pre-commit хук (`npm run lint && npm test`)
- Git-репозиторій ініціалізовано, перший коміт у форматі Conventional Commits

## Що лишається зробити студенту (поза межами того, що можна виконати тут)

Ці пункти вимагають вашого особистого GitHub-акаунту, реальної feature-branch роботи в
команді/самостійно та ручного порівняння інструментів, тож завершіть їх самостійно:

1. Створити приватний/публічний репозиторій на своєму GitHub, запушити цей код
   (`git remote add origin ... && git push -u origin main`).
2. Далі вести розробку через **feature-гілки** (`feature/pagination`, `feature/search` тощо)
   з окремими комітами за Conventional Commits (`feat:`, `fix:`, `test:`, `chore:` ...).
3. В окремій гілці `vite-migration` замінити `webpack.config.js` на `vite.config.ts`
   (dev-сервер, збірка, обробка TS і Bootstrap CSS) так, щоб застосунок працював ідентично.
4. Задеплоїти обидва варіанти (або фінальну гілку) на `gh-pages`.
5. Написати висновок у звіті, що порівнює webpack і Vite за швидкістю старту dev-сервера,
   складністю конфігурації, розміром продакшн-збірки тощо — за вашим особистим досвідом
   налаштування обох варіантів.
6. Відповісти на контрольні питання зі звіту (архітектура вже дає готові відповіді на
   більшість із них — просто спираючись на код).
