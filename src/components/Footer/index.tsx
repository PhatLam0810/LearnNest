import React from 'react';
import './styles.scss';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__brand">
          <img
            src="https://ttth.vhu.edu.vn/wp-content/uploads/2020/02/logo-ttthvhu.png"
            alt="Trung Tâm Tin Học - Đại Học Văn Hiến"
            className="app-footer__logo"
          />
        </div>

        <div className="app-footer__info">
          <p className="app-footer__line app-footer__line--strong">
            Trụ sở chính:
          </p>
          <p className="app-footer__line">
            • HungHau House: 613 Âu Cơ, Phường Tân Phú, TP.HCM
          </p>
          <p className="app-footer__line app-footer__line--strong">
            Các cơ sở đào tạo:
          </p>
          <p className="app-footer__line">
            • Harmony Campus: 624 Âu Cơ, Phường Bảy Hiền, TP.HCM
          </p>
          <p className="app-footer__line">
            • HungHau Campus: Khu chức năng, 13E Đại lộ Nguyễn Văn Linh, Xã Bình
            Hưng, TP.HCM
          </p>
          <p className="app-footer__line">
            • myU Campus: 665-667-669 Điện Biên Phủ, Phường Bàn Cờ, TP.HCM
          </p>
          <p className="app-footer__line">
            • 8-14 Nguyễn Bá Tuyển, Phường Bảy Hiền, TP.HCM
          </p>
          <p className="app-footer__line">
            • 2A2 Quốc lộ 1A, Phường Thới An, TP.HCM
          </p>
          <p className="app-footer__line">
            • 615 Âu Cơ, Phường Tân Phú, TP.HCM
          </p>
          <p className="app-footer__line app-footer__link">
            Email: info@vhu.edu.vn
          </p>
          <p className="app-footer__line">Mã trường: DVH - Hotline: 18001568</p>
        </div>

        <div className="app-footer__copyright">
          COPYRIGHT © 2025. VAN HIEN UNIVERSITY. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
