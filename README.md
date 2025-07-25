## 🚀 Обзор

Проект «Сервис межгалактической аналитки» использует автоматизированное тестирование для проверки ключевых сценариев работы приложения и предотвращения регрессий при добавлении новых функций.

## 📂 Структура тестов (папка `src/tests`)

| Файл                        | Тип тестов              | Описание                                                                                                                 |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `generator.test.tsx`        | Компонентные (E2E/Unit) | Тесты страницы генератора CSV: проверяют успешную генерацию и скачивание файла, а также обработку ошибок при сбое fetch. |
| `history.test.ts`           | Unit                    | Тесты утилиты `historyUtil`: получение, добавление, удаление и очистка истории в `localStorage`.                         |
| `historyPage.test.tsx`      | Компонентные (Smoke)    | Проверяет, что компонент `HistoryPage` рендерится без ошибок в окружении `jsdom`.                                        |
| `homePage.test.tsx`         | Компонентные (UI)       | Общий smoke-тест `HomePage`: проверяет рендер, базовую структуру и ключевые текстовые элементы.                          |
| `homePageBoundary.test.tsx` | Компонентные (Boundary) | Граничные тесты `HomePage`: состояние без файла, загрузка (processing) и отображение заглушки при отсутствии хайлайтов.  |
| `homePageError.test.tsx`    | Компонентные (Error)    | Тест обработки ошибок в `HomePage`: отображение сообщения об ошибке из сторе при сбое анализа CSV.                       |
| `navigation.test.tsx`       | Компонентные (UI)       | Проверка компонента `Navigation`: наличие трёх пунктов меню с корректными `href` и названиями.                           |

## 🧪 Типы тестов и сценарии

1. **Unit-тесты** (`history.test.ts`)
    - Проверяют логику работы с `localStorage`: чтение, запись, обработка некорректного JSON, удаление и очистку истории.

2. **Компонентные тесты** (React Testing Library + Vitest)
    - **Smoke-тесты**: гарантируют, что компонент рендерится без ошибок (`historyPage`, `homePage`).
    - **UI-тесты**: проверяют, что на странице присутствуют ключевые элементы интерфейса (`homePage`, `navigation`).
    - **Boundary-тесты**: проверяют граничные состояния, например, отсутствие выбранного файла, состояние загрузки и пустые данные (`homePageBoundary`).
    - **Error-тесты**: проверяют корректное отображение ошибок в UI при сбоях (`generator`, `homePageError`).

## 🛠 Используемые технологии

- **Тестовый фреймворк**: [Vitest](https://vitest.dev/)
- **Утилиты для тестирования React**: [@testing-library/react](https://testing-library.com/) + [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)
- **Моки и стабсы**: встроенные возможности Vitest (`vi.spyOn`, `vi.stubGlobal`, `vi.mock`)
- **Среда выполнения**: `jsdom`

## ⚙️ Инструкция по запуску тестов

1. Установить зависимости:

    ```bash
    npm install
    ```

2. Запустить все тесты:

    ```bash
    npm run test
    ```

3. Для интерактивного режима с отслеживанием изменений:

    ```bash
    npm run test:watch
    ```
