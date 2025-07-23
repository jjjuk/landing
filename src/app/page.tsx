'use client'
import { GitHubLogoIcon, DiscordLogoIcon } from '@radix-ui/react-icons'
import { Avatar, Button, ThemeToggle } from '../ui'
import { BackgroundEffect } from '../ui/BackgroundEffect'
import confetti from 'canvas-confetti'
// import { Separator } from '@radix-ui/react-separator'

const DS_CONFETTI_SCALING = 3

const createParticle = (text: string) =>
  confetti.shapeFromText({
    text,
    scalar: DS_CONFETTI_SCALING,
  })

const handleDiscordClick = async () => {
  await confetti({
    scalar: DS_CONFETTI_SCALING,
    particleCount: 120,
    spread: 120,
    shapes: [createParticle('🪲'), createParticle('🐞'), createParticle('❤️')],
    origin: {
      y: 0.65,
    },
  })

  window.open(`https://discord.gg/cpy6P5YNh2`, '_blank')
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-transparent text-neutral-900 dark:text-neutral-100 font-sans px-4 py-10 relative overflow-hidden">
      <BackgroundEffect />

      {/* Theme Toggle - positioned in top-right corner */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      <main className="flex flex-1 flex-col items-center justify-center w-full max-w-2xl gap-12">
        <section className="flex flex-col items-center gap-6 text-center">
          <Avatar
            src="/jjjuk_avatar.png"
            alt="jjjuk avatar"
            fallback="J"
            size="lg"
            className="shadow-lg bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400"
          />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            @jjjuk
          </h1>
          <p className="text-lg sm:text-xl max-w-xl text-neutral-600 dark:text-neutral-300">
            Software developer & entrepreneur.
            <br />
            Building products, communities, and big ideas.
            <br />
            Founder of the SoyDev Discord community.
          </p>
          <div className="flex gap-4 mt-2">
            <Button asChild variant="github">
              <a
                href="https://github.com/jjjuk"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <GitHubLogoIcon className="w-5 h-5" />
                GitHub
              </a>
            </Button>
          </div>
        </section>
        <section className="w-full flex flex-col items-center gap-3 mt-8">
          <div className="flex items-center gap-3">
            <Avatar
              src="/soy_dev_logo.svg"
              alt="SoyDev logo"
              fallback="S"
              size="sm"
              className="shadow bg-gradient-to-tr from-indigo-400 via-sky-300 to-emerald-300"
            />
            <h2 className="text-xl font-semibold">SoyDev Community</h2>
          </div>
          <p className="text-base text-neutral-600 dark:text-neutral-300 max-w-lg text-center">
            A friendly community for developers and tech enthusiasts.
            <br />
            Share knowledge, collaborate, and grow together!
          </p>
          <div className="flex relative gap-4 mt-2">
            <Button
              asChild
              variant="discord"
              onClick={handleDiscordClick}
              className="z-20 cursor-pointer"
            >
              <a rel="noopener noreferrer" className="gap-2">
                <DiscordLogoIcon className="w-5 h-5" />
                Join SoyDev
              </a>
            </Button>
          </div>
        </section>
      </main>
      <footer className="w-full flex items-center justify-center py-6 text-sm text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()} jjjuk.org&nbsp;|&nbsp;
        <p className="">disable Dark Reader for better experience</p>
      </footer>
    </div>
  )
}
