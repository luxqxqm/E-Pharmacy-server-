# E-Pharmacy API

Бекенд для застосунку E-Pharmacy: каталог ліків з пошуком і фільтрами, список аптек, відгуки, реєстрація та вхід користувача, кошик і оформлення замовлення.

- **API:** https://e-pharmacy-server-q6sm.onrender.com
- **Документація (Swagger):** https://e-pharmacy-server-q6sm.onrender.com/api-docs

Сервер на безкоштовному тарифі Render засинає, якщо ним не користуються. Перший запит після паузи може йти до хвилини.

## Стек

- **Node.js 22**, **Express 5** (ES modules)
- **MongoDB** + **Mongoose**
- **celebrate / Joi** для валідації запитів
- **bcrypt** для хешування паролів
- **http-errors**, **pino-http** для обробки помилок і логування
- **swagger-ui-express** для документації

## Запуск локально

```bash
git clone https://github.com/luxqxqm/E-Pharmacy-server-.git
cd E-Pharmacy-server-
npm install
cp .env.example .env   # і заповни значення
npm run dev
```

### Змінні оточення

| Змінна      | Опис                                                                         |
| ----------- | ---------------------------------------------------------------------------- |
| `PORT`      | порт сервера, за замовчуванням `3000`                                        |
| `NODE_ENV`  | `development` або `production` (у production текст 500-помилок приховується) |
| `MONGO_URL` | рядок підключення до MongoDB **з назвою бази**, напр. `.../e-pharmacy?...`   |

### Скрипти

| Команда       | Що робить             |
| ------------- | --------------------- |
| `npm run dev` | запуск з nodemon      |
| `npm start`   | запуск для production |

## Дані

Дані з ТЗ імпортуються в MongoDB (наприклад, через Compass → Add Data → Import JSON):

| Файл                      | Колекція        |
| ------------------------- | --------------- |
| `products.json`           | `products`      |
| `pharmacies.json`         | `stores`        |
| `nearest_pharmacies.json` | `neareststores` |
| `reviews.json`            | `reviews`       |

У `products.json` поля `price` і `stock` записані рядками. Після імпорту їх треба перетворити на числа і прибрати поле `id`, яке дублюється (у mongosh):

```js
db.products.updateMany({}, [
  { $set: { price: { $toDouble: '$price' }, stock: { $toInt: '$stock' } } },
  { $unset: 'id' },
]);
```

Колекції `users`, `sessions`, `carts` і `orders` наповнюються через API.

## Ендпоінти

🔒 означає приватний роут. Для нього потрібен заголовок `Authorization: Bearer <accessToken>`.

### Користувач

| Метод | Шлях                     | Опис                                          |
| ----- | ------------------------ | --------------------------------------------- |
| POST  | `/api/user/register`     | реєстрація                                    |
| POST  | `/api/user/login`        | вхід, повертає `accessToken` і `refreshToken` |
| POST  | `/api/user/refresh`      | нова пара токенів за `refreshToken`           |
| GET   | `/api/user/logout` 🔒    | вихід (видаляє сесію)                         |
| GET   | `/api/user/user-info` 🔒 | ім'я та email поточного користувача           |

### Каталог

| Метод | Шлях                       | Опис                                    |
| ----- | -------------------------- | --------------------------------------- |
| GET   | `/api/products`            | ліки: `?name=&category=&page=&perPage=` |
| GET   | `/api/products/:productId` | деталі продукту                         |
| GET   | `/api/stores`              | усі аптеки                              |
| GET   | `/api/stores/nearest`      | найближчі аптеки                        |
| GET   | `/api/customer-reviews`    | відгуки                                 |

Категорії: `Medicine`, `Heart`, `Head`, `Hand`, `Leg`, `Dental Care`, `Skin Care`.

### Кошик

| Метод | Шлях                    | Опис                                                          |
| ----- | ----------------------- | ------------------------------------------------------------- |
| GET   | `/api/cart` 🔒          | товари в кошику і `totalPrice`                                |
| PUT   | `/api/cart/update` 🔒   | `{ productId, quantity }` задає кількість, `0` прибирає товар |
| POST  | `/api/cart/checkout` 🔒 | оформлення: створює замовлення, списує `stock`, очищає кошик  |

Тіла запитів, приклади і всі коди відповідей описані в Swagger.

## Авторизація

1. `POST /api/user/login` повертає `accessToken` (діє 15 хв) і `refreshToken` (діє 1 день).
2. Клієнт зберігає токени і надсилає `Authorization: Bearer <accessToken>` у приватних запитах.
3. Коли access-токен прострочений, сервер повертає `401 Access token expired`. Тоді клієнт викликає `POST /api/user/refresh` з `refreshToken` і отримує нову пару токенів.
4. `GET /api/user/logout` видаляє сесію, після чого обидва токени перестають діяти.

Токени зберігаються в колекції `sessions`. Новий логін замінює попередню сесію користувача.

## Помилки

Усі помилки повертаються у форматі `{ "message": "..." }` з відповідним статусом: `401`, `404`, `409`, `500`.

Помилки валідації (400) мають формат celebrate:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "validation": {
    "body": {
      "source": "body",
      "keys": ["phone"],
      "message": "Phone must be in format +380XXXXXXXXX"
    }
  }
}
```

## Структура

```
src/
  server.js        — збирає застосунок і підключає роутери
  db/              — підключення до MongoDB
  models/          — Mongoose-моделі
  routes/          — роутери
  controllers/     — обробники запитів
  validation/      — Joi-схеми для celebrate
  middlewares/     — logger, authenticate, 404, errorHandler
  services/        — створення сесій
  constants/       — категорії, тривалість токенів
  docs/            — OpenAPI-специфікація для Swagger
```
