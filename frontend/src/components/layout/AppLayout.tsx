'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AppLayout.module.css'

// Navigation data
const navigationItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/webhook-setup', label: 'Webhook Setup', icon: '🔌' },
  { path: '/brokers', label: 'Brokers', icon: '🏦' },
  { path: '/bots', label: 'Bots', icon: '🤖' },
  { path: '/logs', label: 'Logs', icon: '📋' },
  { path: '/analytics', label: 'Analytics', icon: '📈' },
]

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar */}
      <aside 
        className={`${styles.sidebar} ${
          isSidebarCollapsed ? styles.collapsed : ''
        }`}
      >
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>
            {isSidebarCollapsed ? 'V' : 'Viewzenix'}
          </h1>
        </div>

        {/* Toggle button */}
        <button 
          className={styles.toggleButton}
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? '→' : '←'}
        </button>

        {/* Navigation */}
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            {navigationItems.map((item) => {
              const isActive = pathname === item.path || 
                (item.path !== '/' && pathname?.startsWith(item.path))
              
              return (
                <li key={item.path} className={styles.navItem}>
                  <Link 
                    href={item.path}
                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {!isSidebarCollapsed && (
                      <span className={styles.navLabel}>{item.label}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}