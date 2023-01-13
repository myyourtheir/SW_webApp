
# Нужно обратить внимание в продакшене на путь импорта этого модуля
import basic_functions as bf
import json

def count_len_N_numOfElementsInLists(data): #передаем json считает длину трубы
    L=0
    N=0
    num_of_elements_in_lists = 0
    for i in range(len(data['pipeParams'])):
        num_of_elements_in_lists += data['pipeParams'][i][0]
        L += data['pipeParams'][i][0] * 1000
        N += data['pipeParams'][i][0]
    num_of_elements_in_lists += len(data['pumpParams']) * 2 + len(data['gateValveParams']) * 2 + 2
    L+=2000
    N += 3
    return (L, N, num_of_elements_in_lists)

def make_x(data, L, N):
    dx = L / N
    x = 0
    xx = []
    count_pipe_iter = 0
    for i, y in enumerate(data['pipeline']):
        if y == 'pump' or 'gateValve':
            xx.extend([x, x])
            x += dx
        elif y == 'pipe':
            for j in range((data['pipeParams'][count_pipe_iter][0])):
                xx.append(x)
                x += dx
            count_pipe_iter += 1
        elif y == 'right_boundary' or 'left_boundary':
            xx.append(x)
            x += dx
    return xx






def calculate(data):
    p10 = 156960  # 784800   100м
    g = 9.81
    c = 1000
    o = 0.01
    p20 = 156960  # 20 м
    w0 = 3000
    # Перевод в систему си
    o = o / 1000
    t = 0
    v = 10 * 10**(-6)
    ro = data['condParams'][0][1]
    t_rab = data['condParams'][0][0]
    
    with open("Example.txt") as text_z:
            vis_otm_str = text_z.read().split(',')
            global vis_otm
            vis_otm = []
            for x in vis_otm_str:
                x = int(x)
                vis_otm.append(x)
            text_z.close()
    
    L = count_len_N_numOfElementsInLists(data)[0]
    N = count_len_N_numOfElementsInLists(data)[1]
    num_of_elements_in_lists = count_len_N_numOfElementsInLists(data)[2]
    
    T = L / (N * c)

    P_O = [20 * 10 ** 5] * num_of_elements_in_lists
    V_O = [0.1] * num_of_elements_in_lists
    H_O = []
    for i in P_O:
        H_O.append(i / ro / g)

    Davleniya = [P_O]
    Skorosty = [V_O]
    Napory = [H_O]
    t = 0
    data['pipeline'].append('right_boundary')
    data['pipeline'].insert(0, 'left_boundary')
    while t <= t_rab:
        count_pump_iter = 0
        iter = 0
        main = []
        count_pipe_iter = 0
        count_tap_iter = 0
        for x in data['pipeline']:
            
            if x == 'pump':
                main.append(bf.pump_method(Davleniya, Skorosty, iter,
                 data['pumpParams'][count_pump_iter][0],
                 data['pumpParams'][count_pump_iter][1],
                 data['pumpParams'][count_pump_iter][2],
                 1, data['pumpParams'][count_pipe_iter][1],
                 data['pumpParams'][count_pump_iter][4],
                 data['pumpParams'][count_pump_iter][3]))
                main.append(bf.pump_method(Davleniya, Skorosty, iter,
                 data['pumpParams'][count_pump_iter][0],
                 data['pumpParams'][count_pump_iter][1],
                 data['pumpParams'][count_pump_iter][2],
                 2, data['pumpParams'][count_pipe_iter][1],
                 data['pumpParams'][count_pump_iter][4],
                 data['pumpParams'][count_pump_iter][3]))
                count_pump_iter += 1

            elif x == 'pipe':
                for j in range(data['pipeParams'][count_pipe_iter][0]):
                        main.append(bf.pipe_method(Davleniya, Skorosty, iter, data['pipeParams'][count_pipe_iter][1]))
                        iter += 1
                count_pipe_iter += 1

            elif x == 'gateValve':
                    main.append(bf.tap_method(Davleniya, Skorosty, iter, 1, data['gateValveParams'][count_tap_iter][0],
                            data['gateValveParams'][count_tap_iter][1], data['gateValveParams'][count_pipe_iter][1],
                            data['gateValveParams'][count_tap_iter][2], data['gateValveParams'][count_tap_iter][3]))
                    iter += 2
                    count_tap_iter += 1
            
            elif x == 'right_boundary':
                    main.append(bf.right_boundary_method(Davleniya, Skorosty, iter, p20,
                                                      data['pipeParams'][count_pipe_iter - 1][1]))
                    iter += 1

            elif x == 'left_boundary':
                    main.append(
                        bf.left_boundary_method(Davleniya, Skorosty, iter, p10, data['pipeParams'][count_pipe_iter][1]))
                    iter += 1  
        t+=T             
        '''Распаковка main'''     
        p_moment = []
        V_moment = []
        H_moment = []
        for i in range(len(main)):
            p_moment.append(main[i][0])
            V_moment.append(main[i][1])
            H_moment.append(main[i][2])
        Davleniya.append(p_moment)
        Skorosty.append(V_moment)
        Napory.append(H_moment)
        
    x = make_x(data, L, N) 
    res = {
        'x': x,
        'Davleniya': Davleniya,
        'Skorosty' : Skorosty,
        "Napory": Napory
    }
    


    return res
    




if __name__ =='__main__':
    js = {'condParams': [[1000, 850, 10]],
            'pipeline': ['pipe', 'pump'], 
            'pipeParams': [[1, 1]], 
            'pumpParams': [[1, 1, 1, 1, 1]], 
            'gateValveParams': []}
    print(calculate(js))

    