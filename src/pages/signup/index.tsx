import React, { useEffect } from 'react';
import Footer from '@/components/Footer';
import Logo from '@/assets/logo.svg';
import SignupForm from './form';
import SignupBanner from './banner';
import styles from './style/index.module.less';

export default function SignUpPage() {
  useEffect(() => {
    document.body.setAttribute('arco-theme', 'light');
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
        <div className={styles['logo-text']}>Arco Design Pro</div>
      </div>
      <div className={styles.banner}>
        <div className={styles['banner-inner']}>
          <SignupBanner />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles['content-inner']}>
          <SignupForm />
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
