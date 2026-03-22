# 🤝 Contributing Guidelines
> Please follow these guidelines to maintain code quality and consistency across the project.

## 📌 Branching Strategy

To maintain a clean and stable codebase, **do not make direct changes to the `main` / `master` branch**.  
All development work should be done through dedicated branches following the naming conventions below.

| Branch Name              | Type           | Source Branch | Description                                                      |
| :----------------------- | :------------- | :------------ | :--------------------------------------------------------------- |
| **`main`** (or `master`) | **Production** | N/A           | Production-ready code. **Protected.** No direct edits allowed.   |
| **`feature/*`**          | **Feature**    | `main`        | For new features.<br>Ex: `feature/user-auth`                     |
| **`bugfix/*`**           | **Fix**        | `main`        | For standard bug fixes.<br>Ex: `bugfix/nav-alignment`            |
| **`hotfix/*`**           | **Urgent**     | `main`        | **Urgent** production fixes only.<br>Ex: `hotfix/security-patch` |

## 🔄 Development Workflow

###  The Workflow

1. **Sync with `main` branch**  
   Before starting work, switch to `main` and pull the latest changes:

   ```bash
   git checkout main
   git pull origin main
   ```

   **Alternative**:-

   `git checkout main && git pull origin main`

2. **Create:** Create your branch based on the work type.

   ```bash
   git branch feature/my-cool-feature
   git checkout feature/my-cool-feature
   ```

   **Alternative**:-
   `git checkout -b feature/my-cool-feature`

3. **Work:** Write code and commit.
4. **Push:** Push your branch to GitHub.
   `git push origin feature/my-cool-feature`
5. **Merge:** Open a Pull Request (PR) to merge your branch into `main`.

###  Commit Message Conventions

We adhere to the **Conventional Commits** specification.

### Format

`type(scope): subject`

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Formatting (white-space, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **chore**: Maintenance tasks

**Examples:**

> `feat(auth): add google login`
> `fix(ui): adjust button padding on mobile`


### 🔀 Pull Request Guidelines

- Create a new branch, push your changes, and open a Pull Request to the `main` branch.  
- Ensure your changes are tested and clearly described before submitting.