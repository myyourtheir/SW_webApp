import numpy as np


#T = L / (N * c)

def find_lyam(Re, eps, d):
        if Re < 2320:
            lyam1 = 68 / Re
        elif (10 * eps) > Re >= 2320:
            lyam1 = 0.3164 / Re ** 0.25
        elif (10 * eps) <= Re < (500 * d / o):
            lyam1 = 0.11 * (eps + 68 / Re) ** 0.25
        else:
            lyam1 = 0.11 * (eps) ** 0.25
        return (lyam1)
        
def find_Jb(Davleniya, Skorosty, d, i):
    Vjb = Skorosty
    Re = abs(Vjb) * d / v
    lyamjb = find_lyam(Re, o / d, d)
    Jb = Davleniya - ro * c * Skorosty + lyamjb * ro * Skorosty * abs(
        Skorosty) * T * c / (2 * d) + T * ro * c * g * (vis_otm[i + 1] - vis_otm[i]) / 1000
    return (Jb)

def find_Ja(Davleniya, Skorosty, d, i):
    Vja = Skorosty
    Re = abs(Vja) * d / v
    lyamja = find_lyam(Re, o / d, d)
    Ja = Davleniya + ro * c * Skorosty - lyamja * ro * Skorosty * abs(
        Skorosty) * T * c / (2 * d) - T * ro * c * g * (vis_otm[i] - vis_otm[i - 1]) / 1000
    return (Ja)

def count_H(p, i, V):
    H = p / (ro * g) + vis_otm[i] + (V ** 2) / (2 * g)
    return H

def pump_method(P, V, i, a, b, char, chto_vivodim, d, t_vkl, t_char):
    ''' char( 0 - насоса всегда работает, 1 - насос вкл на tt секунде, 2 - насос выкл на tt сек, другое - выключен)'''

    if char == 0:
        w = w0
    elif char == 1:  # Включение на tt сек
        if t_char <= t <= t_char + t_vkl:
            w = w0 / t_vkl * (t - t_char)
        elif t < t_char:
            w = 0
        else:
            w = w0
    elif char == 2:  # Выключение на ttt сек
        if t < t_char:
            w = w0
        elif t_char <= t <= (t_char + t_vkl):
            w = w0 - w0 / t_vkl * (t - t_char)
        else:
            w = 0
    else:
        w = 0

    a = (w / w0) ** 2 * a  # 302.06   Характеристика насоса # b = 8 * 10 ** (-7)
    S = np.pi * (d / 2) ** 2
    Ja = find_Ja(P[-1][i - 1], V[-1][i - 1], d, i)
    Jb = find_Jb(P[-1][i + 2], V[-1][i + 2], d, i)
    VV = (-c / g + (
            (c / g) ** 2 - b * (S * 3600) ** 2 * ((Jb - Ja) / (ro * g) - a)) ** 0.5) / (
                    b * (S * 3600) ** 2)
    p1 = (Ja - ro * c * VV)
    p2 = (Jb + ro * c * VV)
    H1 = count_H(p1, i, VV)
    H2 = count_H(p2, i, VV)

    if chto_vivodim == 1:
        return [p1, VV, H1]
    else:
        return [p2, VV, H2]

def pipe_method(P, V, i, d):
    """Условие, может быть, нужно будет переписать"""
    Ja = find_Ja(P[-1][i - 1], V[-1][i - 1], d, i)
    Jb = find_Jb(P[-1][i + 1], V[-1][i + 1], d, i)
    pp = (Ja + Jb) / (2)
    VV = (Ja - Jb) / (2 * ro * c)
    H = count_H(pp, i, VV)
    return [pp, VV, H]

def tap_method(P, V, i, chto_vivodim, char, t_char, d, t_otkr, procent):
    ''' char( 0 - кран всегда открыт, 1 - кран открывается на tt секунде, 2 - кран закр на tt сек, другое - закрыт)'''

    # угол открытия крана(стр 446, Идельчик)

    def find_zet(nu):
        if 0 <= nu < 10:
            zet = (0.32 / 10) * nu + 0.04
        elif 10 <= nu < 20:
            zet = (1.6 - 0.36) / 10 * (nu - 10) + 0.36
        elif 20 <= nu < 30:
            zet = (5 - 1.6) / 10 * (nu - 20) + 1.6
        elif 30 <= nu < 40:
            zet = (15 - 5) / 10 * (nu - 30) + 5
        elif 40 <= nu < 50:
            zet = (42.5 - 15) / 10 * (nu - 40) + 15
        elif 50 <= nu < 60:
            zet = (130 - 42.5) / 10 * (nu - 50) + 42.5
        elif 60 <= nu < 70:
            zet = (800 - 130) / 10 * (nu - 60) + 130
        elif 70 <= nu < 80:
            zet = (2500 - 800) / 10 * (nu - 70) + 800
        elif 80 <= nu < 85:
            zet = (6000 - 2500) / 10 * (nu - 80) + 2500
        else:  # 85 <= nu <= 100:
            zet = (10000000 - 6000) / 15 * (nu - 85) + 6000
        return zet

    if char == 0:
        nu = 0
        zet = find_zet(nu)
    elif char == 1:  # открытие на tt сек
        if t_char <= t <= (t_char + t_otkr):
            nu = 100 - procent / t_otkr * (t - t_char)
            zet = find_zet(nu)
        elif t < t_char:
            nu = 100
            zet = find_zet(nu)
        else:
            nu = (100 - procent)
            zet = find_zet(nu)
    elif char == 2:  # закрытие на ttt сек
        if t < t_char:
            nu = 0
            zet = find_zet(nu)
        elif t_char <= t <= (t_char + t_otkr):
            nu = procent / t_otkr * (t - t_char)
            zet = find_zet(nu)
        else:
            nu = procent
            zet = find_zet(nu)
    else:
        nu = 100
        zet = find_zet(nu)

    Ja = find_Ja(P[-1][i - 1], V[-1][i - 1], d, i)
    Jb = find_Jb(P[-1][i + 2], V[-1][i + 2], d, i)
    VV = (-2 * c * ro + (abs(4 * (ro * c) ** 2 - 2 * zet * ro * (Jb - Ja))) ** 0.5) / (
            zet * ro)
    if (4 * (ro * c) ** 2 - 2 * zet * ro * (Jb - Ja)) < 0:
        VV = -VV
    else:
        VV = VV
    p1 = (Ja - ro * c * VV)
    p2 = (Jb + ro * c * VV)
    H1 = count_H(p1, i, VV)
    H2 = count_H(p2, i, VV)
    if chto_vivodim == 1:
        return [p1, VV, H1]
    else:
        return [p2, VV, H2]

def right_boundary_method(P, V, i, p_const, d):

    Ja = find_Ja(P[-1][i - 1], V[-1][i - 1], d, i)
    VV = (Ja - p_const) / (ro * c)
    pp = p_const
    H = count_H(p_const, i, VV)
    return [pp, VV, H]

def left_boundary_method(P, V, i, p_const, d):
    Jb = find_Jb(P[-1][i + 1], V[-1][i + 1], d, i)
    VV = (p_const - Jb) / (ro * c)
    pp = p_const
    H = count_H(p_const, i, VV)
    return [pp, VV, H]

if __name__ =='__main__':
    L = 100 *10**3
    N = int(L/(10**3) + 1)
    T = L / (N * c)
    vis_otm = np.array([0]*N)
    print(len(vis_otm))
