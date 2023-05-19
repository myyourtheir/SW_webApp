
# Нужно обратить внимание в продакшене на путь импорта этого модуля
import basic_functions as bf
import numpy as np
import time

k_list =[]
def count_len_N_numOfElementsInLists(data): #передаем json считает длину трубы
    L=0
    N=0
    num_of_elements_in_lists = 0
    for i in range(len(data['pipeParams'])):
        num_of_elements_in_lists += data['pipeParams'][i][0]
        L += data['pipeParams'][i][0] * 1000
        N += data['pipeParams'][i][0]
    num_of_elements_in_lists += len(data['pumpParams']) * 2 + len(data['gateValveParams']) * 2 +len(data['safeValveParams']) * 2 + 2
    L+=2000
    N += 2 
    # + len(data["pumpParams"])+len(data["gateValveParams"])+len(data["safeValveParams"])

    return (L, N, num_of_elements_in_lists)

def make_x(data, L, N):
    dx = L / N
    x = 0
    xx = []
    count_pipe_iter = 0
    for y in data['pipeline']:
        if y == 'pump' or y == 'gateValve'or y == 'safeValve':
            xx.extend([x, x])
            x += dx
        elif y == 'pipe':
            for j in range((data['pipeParams'][count_pipe_iter][0])):
                xx.append(x)
                x += dx
            count_pipe_iter += 1
        elif y == 'right_boundary' or y == 'left_boundary':
            xx.append(x)
            x += dx
    return xx






def calculate(data):
    print(data['boundaryParams'][1][0])
    print(data['boundaryParams'][1][1])
    t = 0
    g = 9.81
    c = bf.c
    
    
    
    v = data['condParams'][0][2] * 10**(-6)
    ro = data['condParams'][0][1]
    t_rab = data['condParams'][0][0]
    
    
    L = count_len_N_numOfElementsInLists(data)[0]
    N = count_len_N_numOfElementsInLists(data)[1]
    num_of_elements_in_lists = count_len_N_numOfElementsInLists(data)[2]
    
    T = L / (N * c)
    p10 = (0-bf.vis_otm[0])*ro*g
    p20 = (0-bf.vis_otm[N])*ro*g
    
    V_O = [0.00000001] * num_of_elements_in_lists
    H_O = [0] * num_of_elements_in_lists


    Davleniya = [[(H_O[i]-bf.vis_otm[i])*ro*g for i in range(num_of_elements_in_lists)]]
    Skorosty = [V_O]
    Napory = [H_O]
    
    data['pipeParams'].append([100, 1]) 
    t = 0
    times = []
    data['pipeline'].append('right_boundary')
    data['pipeline'].insert(0, 'left_boundary')

    xx = make_x(data, L, N) 
    while t <= t_rab:
        count_pump_iter = 0
        count_pipe_iter = 0
        count_tap_iter = 0
        count_safe_valve_iter =0
        iter = 0
        main = []
        for y in data['pipeline']:
            
            if y == 'pump':
                main.append(bf.pump_method(Davleniya, Skorosty, iter,
                 data['pumpParams'][count_pump_iter][0],
                 data['pumpParams'][count_pump_iter][1],
                 data['pumpParams'][count_pump_iter][2],
                 1, data['pipeParams'][count_pipe_iter][1],
                 data['pumpParams'][count_pump_iter][4],
                 data['pumpParams'][count_pump_iter][3], t, v, ro, T))
                
                main.append(bf.pump_method(Davleniya, Skorosty, iter,
                 data['pumpParams'][count_pump_iter][0],
                 data['pumpParams'][count_pump_iter][1],
                 data['pumpParams'][count_pump_iter][2],
                 2, data['pipeParams'][count_pipe_iter][1],
                 data['pumpParams'][count_pump_iter][4],
                 data['pumpParams'][count_pump_iter][3], t, v, ro, T))
                count_pump_iter += 1
                iter += 2

            elif y == 'pipe':
                ran = data['pipeParams'][count_pipe_iter][0] - 2 if count_pipe_iter == 0 and len(data["pipeParams"][0]) == 1 else data['pipeParams'][count_pipe_iter][0]-1 if  count_pipe_iter ==(len(data["pipeParams"][0]) - 1) or count_pipe_iter == 0 else data['pipeParams'][count_pipe_iter][0]
                
                for j in range(ran):
                        main.append(bf.pipe_method(Davleniya, Skorosty, iter, data['pipeParams'][count_pipe_iter][1], v, ro, T))
                        iter += 1
                count_pipe_iter += 1

            elif y == 'gateValve':
                    main.append(bf.tap_method(Davleniya, Skorosty, iter, 1, data['gateValveParams'][count_tap_iter][0],
                            data['gateValveParams'][count_tap_iter][1], data['pipeParams'][count_pipe_iter][1], 
                            data['gateValveParams'][count_tap_iter][2], data['gateValveParams'][count_tap_iter][3], t, v, ro, T))
                    main.append(bf.tap_method(Davleniya, Skorosty, iter, 2, data['gateValveParams'][count_tap_iter][0],
                            data['gateValveParams'][count_tap_iter][1], data['pipeParams'][count_pipe_iter][1], 
                            data['gateValveParams'][count_tap_iter][2], data['gateValveParams'][count_tap_iter][3], t, v, ro, T))
                    iter += 2
                    count_tap_iter += 1
            
            elif y == 'right_boundary':
                    main.append(bf.right_boundary_method(Davleniya, Skorosty, iter, data['boundaryParams'][1][0], data['boundaryParams'][1][1], data['pipeParams'][count_pipe_iter - 1][1], v, ro, T))
                    iter += 1

            elif y == 'left_boundary':
                    main.append(
                        bf.left_boundary_method(Davleniya, Skorosty, iter, data['boundaryParams'][0][0], data['boundaryParams'][0][1], data['pipeParams'][count_pipe_iter][1], v, ro, T))
                    iter += 1  
                    # print(bf.left_boundary_method(Davleniya, Skorosty, iter, data['boundaryParams'][0][0], data['boundaryParams'][0][1], data['pipeParams'][count_pipe_iter][1], v, ro, T))
            elif y =='safeValve':
                main.append(bf.safe_valve_method(Davleniya, Skorosty, iter, 1, data['safeValveParams'][count_safe_valve_iter][0], 
                                                data['safeValveParams'][count_safe_valve_iter][1], 
                                                data['pipeParams'][count_pipe_iter][1], data['pipeParams'][count_pipe_iter+1][1],
                                                v, ro, T))
                main.append(bf.safe_valve_method(Davleniya, Skorosty, iter, 2, data['safeValveParams'][count_safe_valve_iter][0], 
                                                data['safeValveParams'][count_safe_valve_iter][1], 
                                                data['pipeParams'][count_pipe_iter][1], data['pipeParams'][count_pipe_iter+1][1],
                                                v, ro, T))
                # k_list.append(main[-1][3])
                iter += 2
                count_safe_valve_iter += 1
        times.append(t)
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
        
        yield {
            # 'x': xx,
            'Davleniya': [{"x": x, "y": y/10**6} for x, y in zip(xx, p_moment)],
            'Skorosty' : [{"x": x, "y": y} for x, y in zip(xx, V_moment)],
            "Napory": [{"x": x, "y": y} for x, y in zip(xx, H_moment)],
            't': t,
            # 'max_val': (np.max(H_moment), np.max(p_moment), np.max(V_moment)),
            # 'min_val': (np.min(H_moment), np.min(p_moment), np.min(V_moment))
        }
        # time.sleep(1)
         
    

    

if __name__ =='__main__':
    

    js = {'condParams': [[1, 850, 10]],
    'pipeline': ['pipe'],
    'pipeParams': [[100, 1]],
    'pumpParams': [], 
    'gateValveParams': [],
    'safeValveParams': [],
    'boundaryParams': [[1, 0], [1, 0]]}
    
    
    generator = calculate(js)
    while True:
        a = next(generator)

    