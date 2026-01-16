    <!-- @formatter:off -->

# コンテンツのディレクトリ・ファイル構造定義

```text
contents/
├── 00-introduction/
│   ├── introduction.md
│   ├── shell-history/
│   │   ├── unix-birth-thompson-shell.md
│   │   ├── bourne-shell.md
│   │   ├── c-shell-tcsh.md
│   │   ├── korn-shell-innovation.md
│   │   ├── bash-birth-popularity.md
│   │   ├── zsh-evolution-modernization.md
│   │   ├── modern-shell-environment.md
│   │   └── shell-future-development.md
│   ├── why-learn-shell-script.md
│   ├── environment/
│   │   ├── macos.md
│   │   ├── windows-wsl.md
│   │   └── linux.md
│   ├── shell-types-features/
│   │   ├── what-is-shell.md
│   │   ├── bash/
│   │   │   ├── bash-features-history.md
│   │   │   ├── bash-basic-configuration.md
│   │   │   └── bash-script-writing.md
│   │   ├── zsh/
│   │   │   ├── zsh-features-differences.md
│   │   │   ├── oh-my-zsh-customization.md
│   │   │   └── zsh-script-compatibility.md
│   │   ├── fish/
│   │   │   ├── fish-features-usability.md
│   │   │   └── fish-posix-differences.md
│   │   ├── dash/
│   │   │   ├── dash-lightweight-performance.md
│   │   │   └── system-script-usage.md
│   │   ├── other-shells/
│   │   │   ├── korn-shell.md
│   │   │   ├── tcsh.md
│   │   │   └── powershell.md
│   │   ├── shell-check-switch/
│   │   │   ├── current-shell-check.md
│   │   │   ├── default-shell-change.md
│   │   │   └── temporary-shell-switch.md
│   │   └── posix-compatibility/
│   │       ├── posix-standard.md
│   │       ├── compatible-script-writing.md
│   │       └── shell-specific-features.md
│   └── first-script/
│       ├── create-and-execute.md
│       └── hello-world.md
├── 01-core-syntax/
│   ├── core-syntax.md
│   ├── variables/
│   │   ├── declaration-and-reference.md
│   │   ├── special-variables.md
│   │   └── environment-variables.md
│   ├── quoting/
│   │   ├── single-vs-double-quotes.md
│   │   └── command-substitution.md
│   ├── conditional-branching/
│   │   ├── if-statement.md
│   │   ├── test-command.md
│   │   └── case-statement.md
│   ├── loops/
│   │   ├── for-loop.md
│   │   ├── while-loop.md
│   │   └── until-loop.md
│   ├── functions/
│   │   ├── definition-and-call.md
│   │   ├── arguments-and-return-values.md
│   │   └── scope.md
│   ├── arrays/
│   │   ├── indexed-arrays.md
│   │   └── associative-arrays.md
│   ├── shell-builtin-commands/
│   │   ├── echo-output.md
│   │   ├── eval-execute-string.md
│   │   ├── exit-script-termination.md
│   │   ├── kill-process-termination.md
│   │   ├── ps-process-list.md
│   │   ├── pwd-current-directory.md
│   │   ├── cd-directory-change.md
│   │   ├── read-user-input.md
│   │   ├── export-environment-variables.md
│   │   ├── source-dot-script-loading.md
│   │   ├── type-command-type-check.md
│   │   ├── set-shell-options.md
│   │   ├── unset-variable-removal.md
│   │   ├── alias-command-alias.md
│   │   ├── unalias-alias-removal.md
│   │   ├── history-command-history.md
│   │   ├── fc-history-edit.md
│   │   ├── fg-foreground-process.md
│   │   ├── bg-background-process.md
│   │   ├── jobs-background-list.md
│   │   ├── wait-process-wait.md
│   │   ├── return-function-exit.md
│   │   ├── readlink-symlink-resolve.md
│   │   ├── which-command-path.md
│   │   ├── realpath-actual-path.md
│   │   ├── basename-filename-extract.md
│   │   ├── dirname-directory-extract.md
│   │   ├── ln-link-create.md
│   │   ├── mv-file-move.md
│   │   ├── cp-file-copy.md
│   │   ├── rm-file-delete.md
│   │   ├── mkdir-directory-create.md
│   │   ├── rmdir-directory-delete.md
│   │   ├── chmod-permission-change.md
│   │   └── help-help-display.md
│   └── io-control/
│       ├── redirection/
│       │   ├── stdout-redirection.md
│       │   ├── stderr-redirection.md
│       │   ├── stdin-redirection.md
│       │   └── stdout-stderr-merge.md
│       ├── heredoc/
│       │   ├── basic-heredoc.md
│       │   ├── herestring.md
│       │   └── variable-expansion-control.md
│       ├── pipes/
│       │   ├── basic-pipe.md
│       │   ├── multiple-command-chain.md
│       │   └── tee-command-branch.md
│       ├── command-separators/
│       │   ├── sequential-execution.md
│       │   ├── conditional-execution.md
│       │   └── background-execution.md
│       └── grouping/
│           ├── subshell.md
│           ├── command-group.md
│           └── process-substitution.md
├── 02-practical-recipes/
│   ├── practical-recipes.md
│   ├── file-directory-operations/
│   │   ├── check-file-existence.md
│   │   ├── bulk-rename-files.md
│   │   ├── find-and-delete-files.md
│   │   └── backup-script.md
│   ├── text-processing/
│   │   ├── grep-extraction.md
│   │   ├── sed-substitution.md
│   │   ├── awk-reporting.md
│   │   └── csv-manipulation.md
│   ├── process-job-management/
│   │   ├── process-monitoring.md
│   │   └── background-jobs.md
│   └── web-api-integration/
│       ├── curl-get-data.md
│       └── jq-parse-json.md
├── 03-best-practices/
│   ├── best-practices.md
│   ├── error-handling/
│   │   ├── set-e-u-x-o-pipefail.md
│   │   ├── exit-code-checking.md
│   │   └── trap-command.md
│   ├── debugging/
│   │   ├── set-x-tracing.md
│   │   └── shell-debugger.md
│   ├── readability-and-maintenance/
│   │   ├── style-guide.md
│   │   └── commenting.md
│   └── security/
│       ├── secure-temp-files.md
│       └── command-injection.md
├── 04-advanced-topics/
│   ├── advanced-topics.md
│   ├── regular-expressions.md
│   ├── process-substitution-and-pipes.md
│   └── signal-handling.md
└── 05-tools-and-integration/
    ├── tools-and-integration.md
    ├── git-integration.md
    ├── docker-build-automation.md
    └── ci-cd-pipelines.md
```
