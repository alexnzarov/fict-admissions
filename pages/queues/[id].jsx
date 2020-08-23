import useSWR from 'swr';
import { useRouter } from 'next/router';
import * as api from '../../util/api';
import { useState, useRef } from 'react';
import ErrorMesage from '../../components/ErrorMessage';
import PageContainer from '../../components/PageContainer';
import statuses from '../../util/status';
import Pagination from '../../components/Pagination';

const PositionRow = ({ n, queue: q, position: p, update }) => {
  const { user: u } = p;
  const isMounted = useRef(true);
  const router = useRouter();
  const status = !q.active ? statuses.notActive : statuses[p.status];
  const [loading, setLoading] = useState(false);

  return (
    <tr>
      <th width="0%">{p.status === 'processing' ? '-' : p.relativePosition}</th>
      <th width="0%">{p.code}</th>
      <th width="50%"><a href={`/users/${u.id}`} onClick={() => router.push(`/users/${u.id}`)}>{`${u.firstName}${u.lastName ? ` ${u.lastName}` : ''}`}</a></th>
      <td width="0%">
        <span className={`tag ${status.color}`}>{status.name}</span>
      </td>
      <td width="50%">
        <div className="buttons is-fullwidth is-centered">
          <button 
            className={`button is-success is-small ${loading ? 'is-loading' : ''}`}
            disabled={true}
            onClick={() => {
              router.push(`/?queue=${q.id}&user=${u.id}`);
            }}
          >
            Розглянути
          </button>
          <button 
            className={`button is-warning is-small ${loading ? 'is-loading' : ''}`}
            disabled={loading}
            onClick={async () => {
              const response = window.prompt('На скільки позицій ви хочете посунути цього користувача?', '10');
              const num = parseInt(response);
              if (num && Number.isSafeInteger(num) && num > 0) {
                setLoading(true);

                await api.put(`${api.QUEUE_API}/queues/${q.id}/users/${u.id}`, { status: 'waiting', position: p.position + num })
                  .catch(console.error);

                if (isMounted) {
                  setLoading(false);
                  update();
                }
              }
            }}
          >
            Посунути
          </button>
          <button 
            className={`button is-danger is-small ${loading ? 'is-loading' : ''}`}
            disabled={loading}
            onClick={async () => {
              const yes = window.confirm('Ви впевнені, що хочете видалити цього користувача з черги?');
              if (yes) {
                setLoading(true);

                await api.delete(`${api.QUEUE_API}/queues/${q.id}/users/${u.id}`)
                    .catch(console.error);

                if (isMounted) {
                  setLoading(false);
                  update();
                }
              }
            }}
          >
            Видалити
          </button>
        </div>
      </td>
    </tr>
  );
};

const PAGE_SIZE = 10;

const QueuePage = ({ queue: q, size, update: _update }) => {
  const isMounted = useRef(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const skip = page * PAGE_SIZE;
  const { data, error: listError, revalidate } = useSWR(`${api.QUEUE_API}/queues/${q.id}/users?skip=${skip}&take=${PAGE_SIZE}`, api.fetch, { shouldRetryOnError: true, refreshInterval: 5000 });
  const queueSize = data ? data.count : size;
  const update = () => { revalidate(); _update(); };

  return (
    <div>
      <div className="tags">
        {
          q.active 
            ? <span className="tag is-success">Активна</span>
            : <span className="tag is-danger">Неактивна</span>
        }
        {
          (queueSize) > 0 
          ?
            <div className="tags has-addons like-tag">
              <span className="tag is-info">Очікують</span>
              <span className="tag"><b>{queueSize}</b></span>
            </div>
          : <span className="tag is-warning">Черга порожня</span>
        }
      </div>

      <hr />

      <div className="field is-grouped">
        <button
          className={`button is-info is-fullwidth ${loading ? 'is-loading' : ''}`}
          disabled={true || loading || size === 0}
          onClick={async () => {
            try {
              await api.put(`${api.QUEUE_API}/queues/${q.id}`, { active: !q.active });

              if (isMounted) {
                update();
                setLoading(false);
              }
            } catch (e) {
              if (isMounted) {
                setLoading(false);
                setError(e);
              }
            }
          }}
        >
          <span>Розглянути наступного</span>
        </button>
        <button
          className={`button ${q.active ? 'is-danger' : 'is-success'} is-outlined ${loading ? 'is-loading' : ''}`}
          disabled={loading}
          onClick={async () => {
            try {
              await api.put(`${api.QUEUE_API}/queues/${q.id}`, { active: !q.active });

              if (isMounted) {
                update();
                setLoading(false);
              }
            } catch (e) {
              if (isMounted) {
                setLoading(false);
                setError(e);
              }
            }
          }}
        >
          <span>{q.active ? 'Зупинити чергу' : 'Відновити чергу'}</span>
        </button>
      </div>

      {
        error &&
        <ErrorMesage error={error} style={{ marginTop: '15px' }} onClose={() => setError(null)} />
      }

      <hr />

      {
        (data && data.count > 0) &&
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Pagination count={data.count} page={page} onChange={(p) => setPage(p)} pageSize={PAGE_SIZE} />
          <div style={{ marginTop: '16px' }}>
            <table className="table is-bordered is-fullwidth is-hoverable" style={{ verticalAlign: 'middle', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Код</th>
                  <th>Користувач</th>
                  <th>Статус</th>
                  <th>Дія</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.positions.map(p => <PositionRow key={p.id} queue={q} position={p} update={update} />)
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  );
};

export default function QueuePageContainer() {
  const router = useRouter();
  const { data, error, revalidate, isValidating } = useSWR(`${api.QUEUE_API}/queues/${router.query.id}`, api.fetch, { shouldRetryOnError: false });
  const name = data ? data.queue.name : 'Завантажується...';

  return (
    <PageContainer title={name}>
      {
        (error && !isValidating)
          ? <ErrorMesage error={error} onClose={() => revalidate()} />
          : (
            !data
              ? <progress className="progress is-medium is-primary" max="100" />
              : <QueuePage size={data.queueSize} queue={data.queue} update={() => revalidate()} />
          )
      }
    </PageContainer>
  )
}