import {Component} from 'react'
import Link from 'next/link'
import Head from 'next/head'
// import Header from '.header'
// import Footer from '.footer'
import { initGA, logPageView } from '../utils/analytics'
import FollowMe from '~/components/pages/followme-twitter'
// Styles
import Scss from '../scss/main.scss'

export default class Layout extends Component {
  componentDidMount () {
    if (typeof window !== 'undefined' && !window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
  }
  render () {
    const { children, title } = this.props
    return (
      <div>
        <Head>
          <title>{ title }</title>
          <meta charSet='utf-8' />
          <meta name="viewport" content="initial-scale=1.0, width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
          <link rel="shortcut icon" type='image/x-icon' href="/static/favicon.ico"/>
          <link rel="stylesheet" type="text/css" href="/static/css/bundle.css"/>
          {/* Chrome, Firefox OS and Opera */}
          <meta name="theme-color" content="#282d47" />
        </Head>
        <header>
          { /*
          <nav>
            <Link href='/'><a>Home</a></Link> |
            <Link href='/images'><a>Images blog</a></Link> |
            <Link href='/about'><a>About</a></Link> |
            <Link href='/ressources'><a>Ressources</a></Link> |
            <Link href='/contact'><a>Contact</a></Link>
          </nav>
          */ }
        </header>

        { children }

        <footer>
          <p style={{ textAlign: 'center' }}>
            <FollowMe userId="Autre_planete" />
          </p>
          <p>© 1994 - {new Date().getFullYear()} Thierry Charbonnel - All Rights Reserved</p>
        </footer>

        <style jsx>{`
          footer {
            font-size: 0.6666em;
            text-align: center;
            color: #5576A6;
          }

          nav {

            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            height: 48px;
            background-color: rgba(0,0,0,0.2);
            text-align: center;
          }

        `}</style>
      </div>
    )
  }
}
