# Adding your own language to Riju

Hello and welcome! This tutorial guides you through the basics of
adding a new language to Riju, or modifying an existing language. The
other documentation in this repo has reference material that may be
helpful for advanced use cases, but this page should get you started.

If you run into any trouble following the guide, please do not
hesitate to open an issue!

## Project setup

Fork this repository to your account on GitHub, and clone it locally:

```
$ git clone https://github.com/yourname/riju.git
$ cd riju
```

Install [Docker](https://www.docker.com/). Then you can build and
start the admin shell:

```
$ make image shell I=admin
```

All future operations can be done inside the admin shell, where Riju's
dependencies are already installed.

## Start tmux

Start a tmux session:

```
$ make tmux
```

If you don't know how to use tmux, see [a
cheatsheet](https://danielmiessler.com/study/tmux/). The useful
keybindings are:

* `control-b c`: open new tab
* `control-b p/n`: previous/next tab
* `control-b "`: split tab into top and bottom panes
* `control-b %`: split tab into left and right panes
* `control-b <arrows>`: move between panes
* `control-b control-b <something>`: if you have two tmuxes nested,
  use `control-b` twice to do a command on the inner one instead of
  the outer one

## Fetch base Ubuntu image

Make sure you're using the same version of Ubuntu as the mainline
Riju:

```
$ make sync-ubuntu
```

## Start Riju server

Use `dep`, the Riju build tool, to compile the Docker image that the
Riju server will run inside:

```
$ dep image:runtime
```

Start Riju in development mode:

```
$ make shell I=runtime E=1 CMD="make dev"
```

You should now be able to navigate to <http://localhost:6119> and see
that Riju is running, although it does not have any languages
installed.

We are now ready to start creating your new language.

## Create a language configuration

Create a file `langs/mylanguage.yaml` with the following contents
(replacing `mylanguage` and `My Language` with appropriate values,
like `objectivecpp` and `Objective-C++`):

```yaml
id: "mylanguage"
name: "My Language"

main: "TODO"
template: |
  # Fill this in later

run: |
  echo "Hello, world!"
```

Open a new tmux pane in the admin shell (`control-b c`) and build the
Docker image for your language:

```
$ dep image:lang-mylanguage
```

Once that completes, you should see your language at
<http://localhost:6119>. Furthermore, you can run `make sandbox
L=mylanguage` to test your language at the command line (e.g. type
`run` to print `Hello, world!`). Each time you modify the language
configuration, run `dep image:lang-mylanguage` to update the language.

Follow these steps to get from "Hello, world" to running your actual
language:

* [Install your language](tutorial/install.md)
* [Provide run commands](tutorial/run.md)
* [Add code formatter](tutorial/formatter.md)
* [Add language server](tutorial/lsp.md)
* [Configure tests](tutorial/tests.md)
* [Provide metadata](tutorial/metadata.md)
