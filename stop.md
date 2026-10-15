### Как очистить зависшие Docker-сборки на VPS

1\. Найти зависшие процессы:

```
ps -eo pid,ppid,stat,etime,cmd | grep -E '[n]uxt build|[s]trapi build|[n]pm run build|[b]uildx|[d]ocker compose.*build|[m]ake.*prod'
```

2\. Остановить деплой:

В терминале с `make prod` нажми `Ctrl+C`.

Если процессы остались, заверши их по PID:

```
kill PID1 PID2 PID3
```

Если не завершаются:

```
kill -9 PID1 PID2 PID3
```

Используй актуальные PID из шага 1, не старые номера. Сначала останавливай `make` / `docker compose`, затем оставшиеся процессы сборки.

3\. Проверить, что всё завершилось:

```
ps -eo pid,ppid,stat,cmd | grep -E '[n]uxt build|[s]trapi build|[n]pm run build|[b]uildx|[d]ocker compose.*build|[m]ake.*prod'
```

В идеале вывод пустой.

4\. Проверить освобождение памяти:

```
free -h
```

5\. При необходимости проверить Docker:

```
docker ps -a
```

### Чего НЕ делать

- Не используй `pkill -9 node` — можно остановить работающие приложения.
- Не выполняй `docker system prune -a` — удалишь потенциально нужные образы и кэш.
- Не выполняй `swapoff -a` при нехватке RAM.
- Не перезапускай Docker без необходимости.

Главное: `kill` → проверка процессов → `free -h`. В прошлый раз этого хватило для освобождения памяти.